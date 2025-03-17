import React from "react";
import { useNavigate } from "react-router-dom";

const YourVideos = () => {
  const navigate = useNavigate();

  const videos = [
    { title: "My Portfolio Website", thumbnail: "/thumbnails/portfolio.jpg" },
    { title: "How I Built My Startup", thumbnail: "/thumbnails/startup.jpg" },
    { title: "AI in Web Development", thumbnail: "/thumbnails/ai.jpg" },
    { title: "Freelancing Guide", thumbnail: "/thumbnails/freelance.jpg" },
  ];

  return (
    <div>
      <h1>Your Videos</h1>
      <button onClick={() => navigate("/u")}>Back</button>
      <div className="video-list">
        {videos.map((video, index) => (
          <div key={index} className="video-card">
            <img src={video.thumbnail} alt={video.title} />
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourVideos;
