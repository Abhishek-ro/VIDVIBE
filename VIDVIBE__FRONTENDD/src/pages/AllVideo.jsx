import { useState, useEffect, useRef } from "react";
import { getVideos, getUsernameById } from "../API";
import { VideoBox } from "./VideoBox.jsx";

export const VideosList = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollTimeout = useRef(null);
  const limit = 8; // No need for useState since it’s static

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * limit;
        const res = await getVideos(offset, limit);
        const newVideos = res?.data?.videos || [];
        
        setVideos((prev) => [...prev, ...newVideos]);
        setHasMore(newVideos.length > 0 && res?.data?.hasMore !== false);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page, limit]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        hasMore &&
        !loading &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
      ) {
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
          setPage((prevPage) => prevPage + 1);
        }, 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  return (
    <div className="video-container">
      {videos
        .filter(
          (video, index, self) =>
            index === self.findIndex((v) => v._id === video._id)
        )
        .map((video) => (
          <VideoItem key={video._id} video={video} />
        ))}
      {loading && hasMore && <p>Loading more videos...</p>}
    </div>
  );
};

const VideoItem = ({ video }) => {
  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    if (!video.owner) return;

    const fetchUsername = async () => {
      try {
        const res = await getUsernameById(video.owner);
        setUsername(res?.data?.username || "Unknown User");
      } catch {
        setUsername("Error fetching username");
      }
    };

    fetchUsername();
  }, [video.owner]);

  return <VideoBox video={video} username={username} />;
};
