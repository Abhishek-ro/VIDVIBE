import React from "react";
import { useNavigate } from "react-router-dom";

const WatchHistory = () => {
  const navigate = useNavigate();

  const videos = [
    { title: "CSS Grid Guide", thumbnail: "/thumbnails/css.jpg" },
    { title: "Tailwind CSS Tutorial", thumbnail: "/thumbnails/tailwind.jpg" },
    { title: "Next.js Overview", thumbnail: "/thumbnails/next.jpg" },
    { title: "Vue vs React", thumbnail: "/thumbnails/vue.jpg" },
  ];

  return (
    <div>
      <h1>Watch History</h1>
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

export default WatchHistory;
