import "./Recommended.css";
import { getVideos, getUsernameById } from "../../API/index.js";
import { useEffect, useState, useRef, useCallback } from "react";


const Recommended = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const videoIds = useRef(new Set()); 
  const loaderRef = useRef(null);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (let key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  const fetchVideos = useCallback(async () => {
    if (!hasMore) return;
    const limit=8
    try {
      const res = await getVideos(limit,page);
      const videoData = res?.data?.videos || [];
  
      if (videoData.length === 0) {
        setHasMore(false);
        return;
      }

      const updatedVideos = await Promise.all(
        videoData.map(async (video) => {
          const userRes = await getUsernameById(video.owner);
          return {
            ...video,
            username: userRes?.data?.username?.username || "Unknown",
          };
        })
      );

      
      const newVideos = updatedVideos.filter(
        (video) => !videoIds.current.has(video._id)
      );
      
      newVideos.forEach((video) => videoIds.current.add(video._id));

      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setPage((prevPage) => prevPage + limit);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }, [page]);

  useEffect(() => {
  }, [hasMore]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchVideos();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchVideos]);

  return (
    <div className="recommended">
      {videos.map((video) => (
        <a
          href  ={`/video/get/${video._id}`}
          key={video._id}
          className="side-video-list"
        >
          <img src={video.thumbnail} alt="Video Thumbnail" />
          <div className="vid-info">
            <h4>{video.title}</h4>
            <p>{video.username}</p>
            <p>
              {video.views} Views • {timeAgo(video.createdAt)}
            </p>
          </div>
        </a>
      ))}
      {hasMore &&  (
        <div ref={loaderRef} className="loader">
          Loading more...
        </div>
      )}
    </div>
  );
};

export default Recommended;
