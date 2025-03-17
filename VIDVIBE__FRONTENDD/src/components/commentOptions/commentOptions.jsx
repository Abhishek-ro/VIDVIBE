import React, { useEffect, useState } from "react";
import "./CommentOptions.css";
import { updateComments, deleteComment } from "../../API/index.js";

const CommentOptions = ({ id, commentUserId, currentUserId }) => {
    console.log(id,commentUserId,currentUserId)
  const [newComment, setNewComment] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [updateDataInDataBase, setUpdateDataInDataBase] = useState("");

  const updateComment = async () => {
    if (!newComment.trim()) {
      console.log("Comment cannot be empty");
      return;
    }

    try {
      console.log("Updating comment with ID:", id, "New Data:", newComment);
      const updateData = await updateComments(id, { text: newComment });
      setUpdateDataInDataBase(updateData);
      setNewComment("");
      setShowInput(false);
    } catch (error) {
      console.log("Error updating comment:", error);
    }
  };

  useEffect(() => {
    console.log("New comment:", newComment);
  }, [newComment]);

  useEffect(() => {
    console.log("New data saved:", updateDataInDataBase);
  }, [updateDataInDataBase]);

  const handleDelete = async () => {
    try {
      console.log("Deleting comment with ID:", id);
      const deleteData = await deleteComment(id);
      console.log("Deleted Comment Response:", deleteData);
    } catch (error) {
      console.log("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment-options">
      {currentUserId === commentUserId ? (
        <>
          <button
            className="option-btn"
            onClick={() => setShowInput(!showInput)}
          >
            Update
          </button>
          <button className="option-btn" onClick={handleDelete}>
            Delete
          </button>

          {showInput && (
            <div className="update-box">
              <input
                type="text"
                placeholder="Enter new comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="update-input"
              />
              <button className="send-btn" onClick={updateComment}>
                Send
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="unauthorized-msg">
          You are not authorized to edit this comment.
        </p>
      )}
    </div>
  );
};

export default CommentOptions;
