import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLibrary.css";
import {
  likedVideos,
  watcheHistory,
  getYourVideos,
  updateVideo,
  toggleVideoVisibility,
  deleteVideo,
} from "../../API/index.js";
import { formatDistanceToNow } from "date-fns";
import option from "../../assets/options.png";
import useTheme from "../../contexts/theme.js";

const UserLibrary = () => {
  const navigate = useNavigate();
  const [likedVideoData, setLikedVideoData] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [showOptions, setShowOptions] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const { themeMode } = useTheme();
  const [updateDetails, setUpdateDetails] = useState({
    id: "",
    title: "",
    description: "",
    thumbnail: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liked, history, user] = await Promise.all([
          likedVideos(),
          watcheHistory(),
          getYourVideos(),
        ]);

        setLikedVideoData(
          liked?.data?.data
            ?.map((e) => ({
              ...e.video,
              likedAt: new Date(e.updatedAt),
            }))
            .sort((a, b) => b.likedAt - a.likedAt) || []
        );

        setWatchHistory(
          history?.data?.message?.history.map((e) => e.video) || []
        );
        setUserVideos(user?.data?.message?.videos || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      const user = await getYourVideos();
      setUserVideos(user?.data?.message?.videos || []);
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
      const user = await getYourVideos();
      setUserVideos(user?.data?.message?.videos || []);
    } catch (error) {
      console.error("Error toggling video status:", error);
      alert("Failed to toggle video status.");
    }
  };
  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "0:00";

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

      setUserVideos((prev) =>
        prev.filter((video) => video._id !== showDeleteConfirm)
      );

      setShowDeleteConfirm(null);
      alert("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video.");
    }
  };

  const renderVideoRow = (title, videos = [], route) => (
    // Rest of the renderVideoRow function remains the same
    <div
      className={`${themeMode === "dark" ? "video-sectionD" : "video-section"}`}
    >
      <h2
        className={`${themeMode === "dark" ? "video-titleD" : "video-title"}`}
      >
        {title}
      </h2>
      {videos.length > 0 ? (
        <div className="video-row-container">
          <div className="video-row">
            {videos
              .filter((video) => video && video._id)
              .map((video) => (
                //Rest of video card remains same.
                <div
                  key={video._id}
                  className={`${
                    themeMode === "dark" ? "video-cardD" : "video-card"
                  }`}
                >
                  <div
                    className="thumbnail-container"
                    onClick={() => navigate(`/video/get/${video._id}`)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="thumbnail"
                    />
                    <div className="video-duration">
                      {console.log(video)}
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  <div className="video-info">
                    <p className="video-title-text">{video.title}</p>
                    {title === "Your Videos" && (
                      <div className="option-container">
                        <img
                          src={option}
                          alt="Options"
                          className="option-button"
                          onClick={() =>
                            setShowOptions(
                              showOptions === video._id ? null : video._id
                            )
                          }
                        />
                        {showOptions === video._id && (
                          <div className="options-menu">
                            <p onClick={() => handleUpdateClick(video)}>
                              Update Details
                            </p>
                            <p onClick={() => handleToggleClick(video._id)}>
                              Toggle Publish
                            </p>
                            <p onClick={() => handleDeleteClick(video._id)}>
                              Delete Video
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="video-views">
                      {video.views} views •{" "}
                      {video.createdAt
                        ? formatDistanceToNow(new Date(video.createdAt), {
                            addSuffix: true,
                          })
                        : "Unknown time"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <button className="see-all-btn" onClick={() => navigate(route)}>
            See All
          </button>
        </div>
      ) : (
        <p className="no-video-message">No videos available</p>
      )}
    </div>
  );

  return (
    <div
      className={`${
        themeMode === "dark" ? "library-containerD" : "library-container"
      }`}
    >
      {renderVideoRow("Liked Videos", likedVideoData, "/liked-videos")}
      {renderVideoRow("Watch History", watchHistory, "/watch-history")}
      {renderVideoRow("Your Videos", userVideos, "/your-videos")}

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
    </div>
  );
};

export default UserLibrary;
