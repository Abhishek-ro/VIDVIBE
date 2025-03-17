import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getSubscribedVideos,
  getUserId,
  getUsernameById,
} from "../../API/index.js";
import "./Feed.css";
import { formatDistanceToNow } from "date-fns";

const SubscribedFeed = () => {
  const [videos, setVideos] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  // Fetch subscribed videos
  const fetchSubscribedVideos = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await getUserId();
      setUserInfo(userData?.data?.data);

      const subRes = await getSubscribedVideos(userData?.data?.data?._id);
      const videoData = subRes?.data?.data || [];

      const updatedVideos = await Promise.all(
        videoData.map(async (video) => {
          const userRes = await getUsernameById(video.owner);
          return {
            ...video,
            username: userRes?.data?.username?.username || "Unknown",
          };
        })
      );

      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error fetching subscribed videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribedVideos();
  }, []);

  return (
    <div className="feed">
  {videos.length > 0 ? (
    videos.map((video) => (
      <Link to={`/video/get/${video._id}`} className="card" key={video._id}>
        <div className="thumbnail-container">
          <img src={video.thumbnail} alt={video.title} />
        </div>
        <div className="card-content">
          <h2 className="truncate">{video.title}</h2>
          <h3 className="truncate">{video.username}</h3>
          <p>
            {video.views} views •{" "}
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
        </div>
      </Link>
    ))
  ) : (
    !loading && <p className="no-more">No subscribed videos available.</p>
  )}
  {loading && <p className="loading">Loading...</p>}
</div>
  );
};

export default SubscribedFeed;
