import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLibrary.css";
import {
  likedVideos,
  watcheHistory,
  getYourVideos,
  updateVideo,
  deleteVideo,
  toggleVideoVisibility,
} from "../../API/index.js";
import { formatDistanceToNow } from "date-fns";
import option from "../../assets/options.png";

const UserLibrary = () => {
  const navigate = useNavigate();
  const [likedVideoData, setLikedVideoData] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [toggleConfirmation, setToggleConfirmation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchLikedVideos();
        await fetchWatchHistory();
        await fetchUserVideos();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      const likedData = await likedVideos();
      console.log("Liked Videos API Response:", likedData);
      const mappedVideos =
        likedData?.data?.data?.map((e) => ({
          ...e.video,
          likedAt: e.updatedAt,
        })) || [];
      setLikedVideoData(
        mappedVideos.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
      );
    } catch (error) {
      console.error("Error fetching liked videos:", error);
    }
  };

  const fetchWatchHistory = async () => {
    try {
      const historyVideos = await watcheHistory();
      console.log("Watch History API Response:", historyVideos);
      setWatchHistory(
        historyVideos?.data?.message?.history.map((e) => e.video) || []
      );
    } catch (error) {
      console.error("Error fetching watch history:", error);
    }
  };

  const fetchUserVideos = async () => {
    try {
      const userData = await getYourVideos();
      console.log("User Videos API Response:", userData);

      const videos = userData?.data?.message?.videos || [];
      if (!Array.isArray(videos)) {
        console.error("Expected an array but got:", videos);
        setUserVideos([]);
        return;
      }

      setUserVideos([...videos]); // Force state update
    } catch (error) {
      console.error("Error fetching user videos:", error);
    }
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const UpdateVideoDetails = (video) => {
    setSelectedVideo(video);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedVideo({ ...selectedVideo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVideo(selectedVideo._id, {
        title: selectedVideo.title,
        description: selectedVideo.description,
        thumbnail: selectedVideo.thumbnail,
      });

      setSelectedVideo(null);
      await fetchUserVideos(); // Ensure state updates correctly
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  const confirmDelete = (video) => {
    setDeleteConfirmation(video);
  };

  const handleDelete = async () => {
    try {
      await deleteVideo(deleteConfirmation._id);
      setDeleteConfirmation(null);
      await fetchUserVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const confirmToggleVisibility = (video) => {
    setToggleConfirmation(video);
  };

  const handleToggleVisibility = async () => {
    try {
      await toggleVideoVisibility(toggleConfirmation._id);
      setToggleConfirmation(null);
      await fetchUserVideos();
    } catch (error) {
      console.error("Error toggling video visibility:", error);
    }
  };

  useEffect(() => {
    console.log("Updated userVideos state:", userVideos);
  }, [userVideos]);

  const renderVideoRow = (title, videos = [], route) => (
    <div className="video-section">
      <h2 className="video-title">{title}</h2>
      {videos.length > 0 ? (
        <div className="video-row-container">
          <div className="video-row">
            {videos
              .filter((video) => video && video._id)
              .map((video) => (
                <div key={video._id} className="video-card">
                  <div
                    className="thumbnail-container"
                    onClick={() => navigate(`/video/get/${video._id}`)}
                  >
                    <img src={video.thumbnail} alt={video.title} />
                  </div>
                  <div className="video-info">
                    <p className="video-title-text">{video.title}</p>
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
    <div className="library-container">
      {renderVideoRow("Liked Videos", likedVideoData, "/liked-videos")}
      {renderVideoRow("Watch History", watchHistory, "/watch-history")}
      {renderVideoRow("Your Videos", userVideos, "/your-videos")}

      {selectedVideo && (
        <div className="update-video-modal">
          <h3>Update Video Details</h3>
          <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={selectedVideo.title}
              onChange={handleInputChange}
              required
            />

            <label>Description:</label>
            <textarea
              name="description"
              value={selectedVideo.description}
              onChange={handleInputChange}
              required
            />

            <label>Thumbnail URL:</label>
            <input
              type="text"
              name="thumbnail"
              value={selectedVideo.thumbnail}
              onChange={handleInputChange}
              required
            />

            <div className="button-group">
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setSelectedVideo(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserLibrary;
