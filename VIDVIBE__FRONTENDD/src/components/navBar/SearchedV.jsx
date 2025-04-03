import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { searchVideos } from "../../API/index.js";
import useTheme from "../../contexts/theme.js";
import { formatDistanceToNow } from "date-fns";
import "./SV.css";

function SearchResults() {
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const query = new URLSearchParams(location.search).get("query");
  const { themeMode } = useTheme();

  useEffect(() => {
    if (!query) return;

    const fetchVideos = async () => {
      try {
        const response = await searchVideos(query);
        console.log(response?.data?.data);
        setVideos(response?.data?.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [query]);

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "0:00";

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="search-container">
      {videos.length > 0 ? (
        <div className="video-list">
          {videos.map((video) => (
            <Link
              to={`/video/get/${video._id}`}
              key={video._id}
              className="video-link"
            >
              <div
                className={
                  themeMode === "dark" ? "video-cardDD" : "video-cardd"
                }
              >
                <div className="video-thumbnail-container">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <div className="video-duration">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div className="video-info">
                  <h3
                    className={
                      themeMode === "dark" ? "video-titleD" : "video-title"
                    }
                  >
                    {video.title.length > 80
                      ? video.title.substring(0, 77) + "..."
                      : video.title}
                  </h3>
                  <p
                    className={
                      themeMode === "dark" ? "video-channelD" : "video-channel"
                    }
                  >
                    {video.views} views •{" "}
                    {formatDistanceToNow(new Date(video.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <div className="channel-info">
                    <img
                      src={video.more[1]}
                      alt="Channel-logo"
                      className="channel-logo"
                    />
                    <span>{video.more[0] || "Unknown Channel"}</span>
                  </div>
                  <p
                    className={
                      themeMode === "dark" ? "video-detailsD" : "video-details"
                    }
                  >
                    
                    {video.description.length > 110
                      ? video.description.substring(0, 107) + "..."
                      : video.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-results">No videos found.</p>
      )}
    </div>
  );
}

export default SearchResults;
