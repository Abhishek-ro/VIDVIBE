import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getYourVideos,
  getUserId,
  getUserData,
  updateVideo,
  toggleVideoVisibility,
  deleteVideo,
} from "../../API/index.js";
import { formatDistanceToNow } from "date-fns";
import useTheme from "../../contexts/theme.js";
import "./YourVideos.css";
import option from "../../assets/options.png";

const YourVideos = () => {
  const [videos, setVideos] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { themeMode } = useTheme();
  const [showOptions, setShowOptions] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [updateDetails, setUpdateDetails] = useState({
    id: "",
    title: "",
    description: "",
    thumbnail: null,
  });

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const userDataRes = await getUserId();
      const userId = userDataRes?.data?.data?._id;
      setUserInfo(userDataRes?.data?.data);

      if (userId) {
        const videoRes = await getYourVideos(userId);
        const videoData = videoRes?.data?.message?.videos || [];
        setVideos(videoData);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleUpdateClick = (video) => {
    setShowOptions(null);
    setShowToggleConfirm(null);
    setShowDeleteConfirm(null);
    setUpdateDetails({
      id: video._id,
      title: video.title,
      description: video.description,
      thumbnail: null,
    });
    setShowUpdateForm(true);
  };

  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVideo(updateDetails.id, updateDetails);
      alert("Video updated successfully!");
      setShowUpdateForm(false);
      fetchVideos();
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video.");
    }
  };

  const handleToggleClick = (videoId) => {
    setShowUpdateForm(false);
    setShowOptions(null);
    setShowDeleteConfirm(null);
    setShowToggleConfirm(videoId);
  };

  const handleConfirmToggle = async () => {
    try {
      if (!showToggleConfirm) return;

      console.log("Toggling publish status for video ID:", showToggleConfirm);
      await toggleVideoVisibility(showToggleConfirm);

      setShowToggleConfirm(null);
      alert("Video publish status updated!");
      fetchVideos();
    } catch (error) {
      console.error("Error toggling video status:", error);
      alert("Failed to toggle video status.");
    }
  };

  const handleDeleteClick = (videoId) => {
    setShowUpdateForm(false);
    setShowOptions(null);
    setShowToggleConfirm(null);
    setShowDeleteConfirm(videoId);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!showDeleteConfirm) return;

      console.log("Deleting video with ID:", showDeleteConfirm);
      await deleteVideo(showDeleteConfirm);

      setVideos((prev) =>
        prev.filter((video) => video._id !== showDeleteConfirm)
      );

      setShowDeleteConfirm(null);
      alert("Video deleted successfully!");
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video.");
    }
  };

  return (
    <>
      <div className={`feed ${themeMode === "dark" ? "dark" : ""}`}>
        {loading && <p className="loading">Loading...</p>}
        {!loading && videos.length === 0 && (
          <p className="no-more">No Videos Uploaded By You</p>
        )}
        {videos.map((video) => (
          <div
            className={`${themeMode === "dark" ? "cardD" : "card"}`}
            key={video._id}
          >
            <Link to={`/video/get/${video._id}`} className="video-link">
              <div className="thumbnail-container">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="thumbnail"
                />
                <div className="video-duration">
                  {formatDuration(video.duration)}
                </div>
              </div>
              <div
                className={`${
                  themeMode === "dark" ? "card-contentD" : "card-content"
                }`}
              >
                <div className="flex">
                  <img
                    src={userInfo?.avatar || "/default-avatar.png"}
                    className="img-pro"
                    style={{ height: "32px", width: "32px" }}
                    alt="channel-img"
                  />
                  <div>
                    <h2 className="truncate">{video.title}</h2>
                    <h3 className="truncate">
                      {userInfo?.username || "Unknown"}
                    </h3>
                    <p>
                      {video.views} views •{" "}
                      {formatDistanceToNow(new Date(video.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="option-container">
              <img
                src={option}
                alt="Options"
                className="option-button"
                onClick={() =>
                  setShowOptions(showOptions === video._id ? null : video._id)
                }
              />
              {showOptions === video._id && (
                <div className="options-menu">
                  <p onClick={() => handleUpdateClick(video)}>Update Details</p>
                  <p onClick={() => handleToggleClick(video._id)}>
                    Toggle Publish
                  </p>
                  <p onClick={() => handleDeleteClick(video._id)}>
                    Delete Video
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showUpdateForm && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <h3>Update Video Details</h3>
            <form onSubmit={handleUpdateFormSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={updateDetails.title}
                onChange={(e) =>
                  setUpdateDetails({ ...updateDetails, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                value={updateDetails.description}
                onChange={(e) =>
                  setUpdateDetails({
                    ...updateDetails,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setUpdateDetails({
                    ...updateDetails,
                    thumbnail: e.target.files[0],
                  })
                }
              />
              <button type="submit">Update</button>
              <button type="button" onClick={() => setShowUpdateForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showToggleConfirm && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <h3>Are you sure you want to toggle publish status?</h3>
            <div className="button-group">
              <button onClick={handleConfirmToggle}>Toggle</button>
              <button onClick={() => setShowToggleConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <h3>Are you sure you want to delete this video?</h3>
            <div className="button-group">
              <button onClick={handleConfirmDelete}>Delete</button>
              <button onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default YourVideos;
