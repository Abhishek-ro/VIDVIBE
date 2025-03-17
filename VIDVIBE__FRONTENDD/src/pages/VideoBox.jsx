import "./VideoBox.css";

import { useState } from "react";

export const VideoBox = ({ video, username }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleClick = () => {
    setSelectedVideo(video);
  };

  return (
    <div>
      <div className="video-card">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="thumbnail"
          onClick={handleClick} // Now it calls handleClick function
        />
        <div className="video-info">
          <h3 className="title">{video.title}</h3>
          <p className="username">@{username}</p>
        </div>
      </div>

      {/* Show VideoPlay component when a video is clicked */}
      
    </div>
  );
};
