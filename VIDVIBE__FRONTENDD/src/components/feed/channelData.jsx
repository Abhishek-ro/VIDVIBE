import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { getChannelVideos } from "../../API/index.js";
import "./Feed.css";

const ChannelData = () => {
  const location = useLocation();
  const channelId = location.state?.channelData; 
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const limit = 16;


  const fetchVideos = useCallback( 
    async (pageNumber = 0, reset = false) => {
      if (!hasMore || loading || !channelId) return; // Ensure channelId exists
      setLoading(true);
      
      try {
        const dataSub = await getChannelVideos(channelId); // Pass correct parameter
        const dataChannel = dataSub?.data?.data?.videos;
        if (!dataChannel || dataChannel.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(dataChannel.length >= limit);
        }

        setVideos((prev) => (reset ? dataChannel : [...prev, ...dataChannel]));
        setPage((prev) => (reset ? limit : prev + limit));
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false); // Ensure loading resets
      }
    },
    [hasMore, loading, channelId]
  );

  useEffect(() => {
    if (!channelId) return;
    setVideos([]);
    setPage(0);
    setHasMore(true);
    fetchVideos(0, true);
  }, [channelId]);

  useEffect(() => {
    if (!hasMore || loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchVideos(page);
    });

    const lastVideo = document.querySelector(".feed .card:last-child");
    if (lastVideo) observer.observe(lastVideo);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [videos, hasMore, loading, fetchVideos]);

  console.log(videos)

  return (
    <div className="feed">
      {videos.map((video) => (
        <Link to={`/video/get/${video._id}`} className="card" key={video._id}>
          <div className="thumbnail-container">
            <img src={video.thumbnail} alt={video.title} />
          </div>
          <div className="card-content">
            <h2 className="truncate">{video.title}</h2>
            <h3 className="truncate">{video.username || "Unknown"}</h3>
            <p>
              {video.views} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </Link>
      ))}
      {loading && <p className="loading">Loading...</p>}
      {!hasMore && !loading && (
        <p className="no-more">No more videos to load.</p>
      )}
    </div>
  );
};

export default ChannelData;
