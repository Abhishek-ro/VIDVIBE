import { asyncHandler } from "../utils/AsyncHandler.js";
import { Video } from "../models/video.models.js";
import { API } from "../utils/APIResponses.js";
import { APIERROR } from "../utils/APIError.js";
import { Subscription } from "../models/subscription.models.js";
import {WatchHistory} from "../models/watch_history.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { deleteFileFromLocalPath } from "../middlewares/multer.middlewares.js";
import path from "path";


const getAllVideos = asyncHandler(async (req, res) => {
  try {
    const {
      offset,
      limit,
      sortBy = "createdAt",
      sortType = "desc",
    } = req.query;
  
    
    const videos = await Video.find({ isPublished : true})
      .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit)); 

    const totalVideos = await Video.countDocuments();
    res.status(200).json({
      success: true,
      videos,
      hasMore: offset + limit < totalVideos, 
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching videos", error });
  }
});



const getAllHomeVideo= asyncHandler(async (req, res) => {
  try {
    console.log("heeeeeeeeeeeeeeeeeeeeeeeee", req.user.username);
    const videos = await Video.find({isPublished:true})
    res.status(200).json({
      success: true,
      videos,
    });
  
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching videos", error });
  }
  
});

const publishAVideo = asyncHandler(async (req, res, next) => {
  

  try {
    const { title, description } = req.body;

    // Validate title and description
    if (!title || !description) {
      return next(new APIERROR(402, "Title and description are required."));
    }

    // Validate files
    const videoFile = req.files?.videoFile?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    
    if (!videoFile || !thumbnailFile) {
      deleteFileFromLocalPath(videoFile?.path);
      deleteFileFromLocalPath(thumbnailFile?.path);
      return next(new APIERROR(402, "Video and thumbnail files are required."));
    }

    // Validate video file extension
    const allowedExtensions = [".mp4", ".mkv", ".webm", ".avi"];
    const videoExtension = path.extname(videoFile.path);
    if (!allowedExtensions.includes(videoExtension)) {
      deleteFileFromLocalPath(videoFile.path);
      deleteFileFromLocalPath(thumbnailFile.path);
      await deleteFromCloudinary(thumbnailFile.path);
      await deleteFromCloudinary(videoFile.path);
      return next(
        new APIERROR(400, `Invalid video file type: ${videoExtension}`)
      );
    }

    if (!videoFile.mimetype.startsWith("video/")) {
      await deleteFromCloudinary(videoFile.path);
      await deleteFromCloudinary(thumbnailFile.path);
      deleteFileFromLocalPath(videoFile.path);
      deleteFileFromLocalPath(thumbnailFile.path);
      return next(new APIERROR(400, "Uploaded file is not a valid video."));
    }

    const thumbnailUrl = await uploadOnCloudinary(thumbnailFile.path);
    if (!thumbnailUrl) {
      await deleteFromCloudinary(thumbnailFile.path);
      await deleteFromCloudinary(videoFile.path);
      deleteFileFromLocalPath(videoFile.path);
      deleteFileFromLocalPath(thumbnailFile.path);
      return next(new APIERROR(402, "Thumbnail upload failed."));
    }

    const videoUrl = await uploadOnCloudinary(videoFile.path);
    if (!videoUrl) {
      await deleteFromCloudinary(videoFile.path);
      await deleteFromCloudinary(thumbnailFile.path);
      return next(new APIERROR(402, "Video upload failed."));
    }

    const duration = videoUrl.duration;

    const newVideo = new Video({
      title,
      description,
      thumbnail: thumbnailUrl.url,
      videoFile: videoUrl.url,
      owner: req.user._id,
      more:[req.user.username, req.user.avatar],
      duration,
    });

    await newVideo.save({ validateBeforeSave: false });
    deleteFileFromLocalPath(videoFile.path);
    deleteFileFromLocalPath(thumbnailFile.path);
    res.status(201).json(new API(201, "Video Published", { newVideo }));
  } catch (error) {
    const videoPath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    deleteFileFromLocalPath(videoPath);
    deleteFileFromLocalPath(thumbnailPath);
    if (videoPath) await deleteFromCloudinary(videoPath);
    if (thumbnailPath) await deleteFromCloudinary(thumbnailPath);
    next(new APIERROR(401, "Cannot publish the video!",error));
  }
});

const getVideoById = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  const userId = req?.user?.id;

  if (!userId) return next(new APIERROR(401, "Unauthorized Access!!!"));

  // Find the video
  const video = await Video.findById(videoId);
  if (!video) return next(new APIERROR(404, "Video not found"));

  // Find or create the user's watch history
  let watchHistory = await WatchHistory.findOne({ user: userId });

  if (!watchHistory) {
    watchHistory = new WatchHistory({ user: userId, videos: [] });
  }

  // Find the index of the video if it exists
  const existingIndex = watchHistory.videos.findIndex(
    (v) => v.video.toString() === videoId
  );

  if (existingIndex !== -1) {
    // If video exists, remove it from its current position
    const [existingVideo] = watchHistory.videos.splice(existingIndex, 1);
    // Shift it to the front
    watchHistory.videos.unshift(existingVideo);
  } else {
    // If video does not exist, add it to the front
    watchHistory.videos.unshift({ video: videoId, watchedAt: new Date() });
  }

  // Save the updated history
  await watchHistory.save();

  res
    .status(200)
    .json(new API(200, "Video found and watch history updated", { video }));
});




const updateVideo = asyncHandler(async (req, res, next) => {
  try {
    const { videoId } = req.params;
    if (!videoId) return next(new APIERROR(400, "Video ID is required"));
    const video = await Video.findById(videoId);
    if (!video) return next(new APIERROR(404, "Video not found"));
    if (video.owner.toString() !== req.user._id.toString()) {
      return next(
        new APIERROR(403, "You are not authorized to update this video")
      );
    }
    console.log("Request body:", req.body);
    console.log("Request files:", req.file, req.files);
    // Extract new values
    const title = req.body.title?.trim() || video.title;
    const description = req.body.description?.trim() || video.description;
    let thumbnail = video.thumbnail;
    const thumbnailFile = req.file || req.files?.thumbnail?.[0];

    if (thumbnailFile) {
      console.log("Uploading new thumbnail to Cloudinary...");

      const thumbnailUpload = await uploadOnCloudinary(thumbnailFile.path);
      if (!thumbnailUpload) {
        await deleteFromCloudinary(thumbnailFile.path);
        return next(new APIERROR(500, "Thumbnail upload failed."));
      }

      // Store new thumbnail URL
      thumbnail = thumbnailUpload.url;

      // Delete previous thumbnail (if exists) after successful upload
      const deletionPromises = [];
      if (video.thumbnail) {
        deletionPromises.push(deleteFromCloudinary(video.thumbnail));
      }
      deletionPromises.push(deleteFromCloudinary(thumbnailFile.path));

      await Promise.all(deletionPromises);
      console.log("Old thumbnail deleted.");
    }

    // Update video properties
    video.title = title;
    video.description = description;
    video.thumbnail = thumbnail;

    await video.save({ validateBeforeSave: false });

    console.log("Video updated successfully.");
    res.status(200).json(new API(200, "Video updated successfully", { video }));
  } catch (error) {
    console.error("Error updating video:", error);
    next(error);
  }
});



const deleteVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  if (!videoId) return next(new APIERROR(400, "Video ID is required"));

  const video = await Video.findById(videoId);
  if (!video) return next(new APIERROR(404, "Video not found"));

  if (video.owner.toString() !== req.user._id.toString()) {
    return next(
      new APIERROR(403, "You are not authorized to delete this video")
    );
  }

  try {
    // Delete files from Cloudinary
    if (video.videoFile) {
      await deleteFromCloudinary(video.videoFile);
    }
    if (video.thumbnail) {
      await deleteFromCloudinary(video.thumbnail);
    }
  } catch (error) {
    console.error("Error deleting files from Cloudinary:", error);
    return next(
      new APIERROR(500, "Failed to delete video files from Cloudinary")
    );
  }

  // Remove video from the database
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  if (!deletedVideo) {
    return next(new APIERROR(500, "Failed to delete video from the database"));
  }

  res.status(200).json(new API(200, "Video deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  if (!videoId) return next(new APIERROR(400, "Video ID is required"));
  const video = await Video.findById(videoId);
  if (!video) return next(new APIERROR(404, "Video not found"));
  if (video.owner.toString() !== req.user._id.toString()) {
    return next(
      new APIERROR(403, "You are not authorized to update this video")
    );
  }
  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: true });
  res.status(200).json(new API(200, "Video publish status updated", { video }));
});

const fetchSubscriptionVideos = asyncHandler(async (req, res) => {
  try {
    const { offset = 0, limit = 16 } = req.query;
    const userId = req?.user?.id;

    // Fetch subscribed channels
    const subscriptions = await Subscription.find({ subscriber: userId })
      .populate("channel")
      .lean(); // Improves performance by returning plain objects

    if (!subscriptions.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No subscribed channels found.",
      });
    }

    // Extract channel IDs
    const channelIds = subscriptions.map((sub) => sub.channel._id);

    // Fetch videos from subscribed channels with pagination
    const videos = await Video.find({ owner: { $in: channelIds } })
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean(); // Optimizes response time
      
    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Error fetching subscription videos:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription videos",
      error: error.message,
    });
  }
});

const searchVideo = asyncHandler(async (req, res) => {
  try {
    const { query, offset = 0, limit = 8 } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { more: { $in: [query] } },
      ],
    })
      .sort({ views: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).json({
      success: false,
      message: "Error searching videos",
      error: error.message,
    });
  }
});



export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllHomeVideo,
  fetchSubscriptionVideos,
  searchVideo,
};
