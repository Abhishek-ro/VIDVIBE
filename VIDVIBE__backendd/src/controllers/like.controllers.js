import { Like } from "../models/like.models.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      throw new APIERROR(400, "Video Id is required");
    }
    const like = await Like.findOne({ video: videoId, likedBy: req.user._id });
    console.log(like);
    if (like) {
      await Like.findByIdAndDelete(like._id);
      return res.status(200).json({ message: "Video unliked successfully" });
    } else {
      await Like.create({ video: videoId, likedBy: req.user._id });
      return res.status(200).json({ message: "Video liked successfully" }); 
    }
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      throw new APIERROR(400, "Comment ID is required");
    }

    const like = await Like.findOne({
      comment: commentId,
      likedBy: req.user._id,
    });

    if (like) {
      await Like.findByIdAndDelete(like._id);
      return res.status(200).json({ message: "Comment unliked successfully" });
    } else {
      await Like.create({ comment: commentId, likedBy: req.user._id });
      return res.status(200).json({ message: "Comment liked successfully" });
    }
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});


const toggleTweetLike = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      throw new APIERROR(400, "Tweet ID is required");
    }

    const like = await Like.findOne({ tweet: tweetId, likedBy: req.user._id });

    if (like) {
      await Like.findByIdAndDelete(like._id);
      return res.status(200).json({ message: "Tweet unliked successfully" });
    } else {
      await Like.create({ tweet: tweetId, likedBy: req.user._id });
      return res.status(200).json({ message: "Tweet liked successfully" });
    }
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new APIERROR(400, "User ID is required");
    }

    const likedVideos = await Like.find({
      likedBy: userId,
      video: { $exists: true },
    })
      .populate("video", "title description")
      .lean();

    if (!likedVideos.length) {
      return res.status(200).json({
        status: "success",
        message: "No liked videos found.",
        data: [],
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        likedVideos,
      },
    });
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});


export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
