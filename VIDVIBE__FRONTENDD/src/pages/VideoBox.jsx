import "./VideoBox.css";

export const VideoBox = ({ video, username }) => {
  return (
    <div className="video-card">
      <img src={video.thumbnail} alt={video.title} className="thumbnail" />
      <div className="video-info">
        <h3 className="title">{video.title}</h3>
        <p className="username">@{username}</p>
      </div>
    </div>
  );
};
