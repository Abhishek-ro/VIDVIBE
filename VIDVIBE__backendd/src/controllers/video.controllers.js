import { asyncHandler } from "../utils/AsyncHandler.js";
import { Video } from "../models/video.models.js";
import { API } from "../utils/APIResponses.js";
import { APIERROR } from "../utils/APIError.js";

import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import path from "path";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    offset = 0,
    limit = 8,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const matchStage = {};
  if (query) {
    matchStage.title = { $regex: query, $options: "i" };
  }
  if (userId) {
    matchStage.owner = userId;
  }

  const sortStage = {};
  sortStage[sortBy] = sortType === "asc" ? 1 : -1;

  try {
    const pipeline = [
      { $match: matchStage },
      { $sort: sortStage },
      { $skip: parseInt(offset) },
      { $limit: parseInt(limit) },
    ];

    const videos = await Video.aggregate(pipeline); // Execute the aggregation pipeline
    const totalVideos = await Video.countDocuments(matchStage); // Count the total videos matching the criteria

    res.status(200).json({
      success: true,
      videos,
      hasMore: offset + limit < totalVideos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching videos" });
  }
});

const publishAVideo = asyncHandler(async (req, res, next) => {
  console.log(req.files);

  try {
    const { title, description } = req.body;

    // Validate title and description
    if (!title || !description) {
      return next(new APIERROR(402, "Title and description are required."));
    }

    // Validate files
    const videoFile = req.files?.videoFile?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    console.log(videoFile, thumbnailFile);
    if (!videoFile || !thumbnailFile) {
      return next(new APIERROR(402, "Video and thumbnail files are required."));
    }

    // Validate video file extension
    const allowedExtensions = [".mp4", ".mkv", ".webm", ".avi"];
    const videoExtension = path.extname(videoFile.path);
    if (!allowedExtensions.includes(videoExtension)) {
      await deleteFromCloudinary(videoFile.path);
      return next(
        new APIERROR(400, `Invalid video file type: ${videoExtension}`)
      );
    }

    if (!videoFile.mimetype.startsWith("video/")) {
      await deleteFromCloudinary(videoFile.path);
      return next(new APIERROR(400, "Uploaded file is not a valid video."));
    }

    const thumbnailUrl = await uploadOnCloudinary(thumbnailFile.path);
    if (!thumbnailUrl) {
      await deleteFromCloudinary(thumbnailFile.path);
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
      duration,
    });

    await newVideo.save({ validateBeforeSave: false });

    res.status(201).json(new API(201, "Video Published", { newVideo }));
  } catch (error) {
    const videoPath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    if (videoPath) await deleteFromCloudinary(videoPath);
    if (thumbnailPath) await deleteFromCloudinary(thumbnailPath);
    next(new APIERROR(401, "Cannot publish the video!"));
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  const video = await Video.findById(videoId);
  if (!video) {
    return next(new APIERROR(404, "Video not found"));
  }
  res.status(200).json(new API(200, "Video found", { video }));
});

const updateVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  if (!videoId) return next(new APIERROR(400, "Video ID is required"));

  const video = await Video.findById(videoId);
  if (!video) return next(new APIERROR(404, "Video not found"));

  if (video.owner.toString() !== req.user._id.toString()) {
    return next(
      new APIERROR(403, "You are not authorized to update this video")
    );
  }

  const title = req.body.title || video.title;
  const description = req.body.description || video.description;

  const thumbnailFile = req.file?.thumbnail?.[0];
  let thumbnail = video.thumbnail;

  if (thumbnailFile) {
    const thumbnailUrl = await uploadOnCloudinary(thumbnailFile.path);
    if (!thumbnailUrl) {
      await deleteFromCloudinary(thumbnailFile.path);
      return next(new APIERROR(402, "Thumbnail upload failed."));
    }
    thumbnail = thumbnailUrl.url;
    if (video.thumbnail) await deleteFromCloudinary(video.thumbnail);
    await deleteFromCloudinary(thumbnailFile.path);
  }

  video.title = title;
  video.description = description;
  video.thumbnail = thumbnail;

  await video.save({ validateBeforeSave: false });
  res.status(200).json(new API(200, "Video updated", { video }));
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

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
