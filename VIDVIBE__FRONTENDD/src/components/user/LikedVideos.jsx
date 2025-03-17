import React from "react";
import { useNavigate } from "react-router-dom";

const LikedVideos = () => {
  const navigate = useNavigate();

  const videos = [
    { title: "React Hooks Explained", thumbnail: "/thumbnails/react.jpg" },
    { title: "Node.js Crash Course", thumbnail: "/thumbnails/node.jpg" },
    { title: "MongoDB Tutorial", thumbnail: "/thumbnails/mongo.jpg" },
    { title: "Express.js in 10 min", thumbnail: "/thumbnails/express.jpg" },
  ];

  return (
    <div>
      <h1>Liked Videos</h1>
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

export default LikedVideos;
