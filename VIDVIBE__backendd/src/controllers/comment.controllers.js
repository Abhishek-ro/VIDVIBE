import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  let page = req.query.p || 0;
  console.log(page)
  const limit = 3;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new APIERROR(400, "Invalid video ID");
  }

  try {
    const skip = page * limit;

    const comments = await Comment.find({ video: videoId })
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    if(!comments.length) throw new APIERROR(404, "No comments found for this video");

    const totalComments = await Comment.countDocuments({ video: videoId });

    const formattedComments = comments.map((comment) => ({
      id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      owner: {
        id: comment.owner,
      },
    }));

    res.status(200).json(
      new API(200, "Comments fetched successfully", {
        totalComments,
        currentPage: Number(page),
        totalPages: Math.ceil(totalComments / limit),
        comments: formattedComments,
      })
    );
  } catch (error) {
    console.error("Error fetching comments:", error); 
    throw new APIERROR(500, "Something went wrong while fetching comments");
  }
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new APIERROR(400, "Video ID is required");
    }
    const { text } = req.body;
    if(!(text.trim())){
        throw new APIERROR(400, "Comment text is required");
    }
    const comment = new Comment({
        video: videoId,
        owner: req.user._id,
        content: text,
    });
    await comment.save({ validateBeforeSave: true });
    res.status(201).json(new API(201, "Comment added", comment));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  console.log("Comment ID:", commentId);
  console.log("Text:", text);
  console.log("User ID:", req.user?._id);

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new APIERROR(400, "Invalid comment ID");
  }

  if (!text || !text.trim()) {
    throw new APIERROR(400, "Comment text is required");
  }

  const comment = await Comment.findById(commentId);

  console.log("Comment Found:", comment);

  if (!comment) {
    throw new APIERROR(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new APIERROR(403, "You are not authorized to update this comment");
  }

  comment.content = text;

  try {
    await comment.save({ validateBeforeSave: true });
    console.log("Updated Comment:", comment);
    res.status(200).json(new API(200, "Comment updated", comment));
  } catch (error) {
    console.error("Error Saving Comment:", error);
    throw new APIERROR(500, "Failed to update comment");
  }
});


const deleteComment = asyncHandler(async (req, res) => {
  const {commentId} = req.params
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new APIERROR(400, "Invalid comment ID");
  }
  const comment = await Comment.findById(commentId);

  console.log("Comment Found:", comment);

  if (!comment) {
    throw new APIERROR(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new APIERROR(403, "You are not authorized to update this comment");
  }
  try {
    await Comment.findByIdAndDelete(comment._id)
    console.log("Comment Deleted:");
    res.status(200).json(new API(200, "Comment Deleted",{}))
  } catch (error) {
    console.error("Error deleting Comment:", error);
    throw new APIERROR(500, "Failed to Delete the comment");
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
