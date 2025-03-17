import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    let { page = 0, limit = 6 } = req.query;

    // Ensure page and limit are integers
    page = parseInt(page, 6);
    limit = parseInt(limit, 6);

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new APIERROR(400, "Invalid video ID");
    }

    const skip = page * limit;

    // Fetch comments with pagination
    const comments = await Comment.find({ video: videoId })
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 }) // Newest comments first
      .skip(skip)
      .limit(limit);

    // Check if more comments exist
    const hasMore = comments.length === limit;

    res.status(200).json({
      success: true,
      comments,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching comments" });
  }
});

const getTotalComments = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new APIERROR(400, "Invalid video ID");
    }

    const comments = await Comment.find({ video: videoId })
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 }); // Newest comments first

    res.status(200).json({
      success: true,
      comments: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching comments" });
  }
});
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new APIERROR(400, "Video ID is required");
  }
  const { text } = req.body;

  if (!text.trim()) {
    throw new APIERROR(400, "Comment text is required");
  }
  const comment = new Comment({
    video: videoId,
    owner: req.user._id,
    content: text,
  });
  await comment.save({ validateBeforeSave: false });
  res.status(201).json(new API(201, "Comment added", comment));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new APIERROR(400, "Invalid comment ID");
  }

  if (!text || !text.trim()) {
    throw new APIERROR(400, "Comment text is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new APIERROR(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new APIERROR(403, "You are not authorized to update this comment");
  }

  comment.content = text;

  try {
    await comment.save({ validateBeforeSave: true });
    res.status(200).json(new API(200, "Comment updated", comment));
  } catch (error) {
    console.error("Error Saving Comment:", error);
    throw new APIERROR(500, "Failed to update comment");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new APIERROR(400, "Invalid comment ID");
  }
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new APIERROR(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new APIERROR(403, "You are not authorized to update this comment");
  }
  try {
    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json(new API(200, "Comment Deleted", {}));
  } catch (error) {
    console.error("Error deleting Comment:", error);
    throw new APIERROR(500, "Failed to Delete the comment");
  }
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  getTotalComments,
};
