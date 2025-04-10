import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { getChannelVideos } from "../../API/index.js";
import "./Feed.css";
import useTheme from "../../contexts/theme.js";
import Loader from "../Loader/Loader.jsx";
const ChannelData = () => {
  const location = useLocation();
  const channelId = location.state?.channelData;
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const limit = 16;
  const { themeMode } = useTheme();


  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "0:00";

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const fetchVideos = useCallback(
    async (pageNumber = 0, reset = false) => {
      if (!hasMore || loading || !channelId) return; 
      setLoading(true);
      if (loading) {
        return <Loader />;
      }
      try {
        const dataSub = await getChannelVideos(channelId);
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
        setLoading(false); 
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

  console.log(videos);

  return (
    <div className="feedH">
      {videos.map((video) => (
        <Link
          to={`/video/get/${video._id}`}
          className={themeMode === "dark" ? "cardD" : "card"}
          key={video._id}
        >
          <div className="thumbnail-container">
            <img src={video.thumbnail} alt={video.title} />
            <div className="video-duration">
              {formatDuration(video.duration)}
            </div>
          </div>
          <div
            className={`${
              themeMode === "dark" ? "card-contentD" : "card-content"
            }`}
          >
            <div className="flex">
              <div>
                <img
                  src={video.more[1]}
                  className="img-pro"
                  style={{ height: "40px", width: "40px" }}
                  alt="chn-img"
                />
              </div>
              <div className="Width-det">
                <h2 className="truncate">{video.title}</h2>
                <h3 className="truncate">{video.more[0] || "Unknown"}</h3>
                <p>
                  {video.views} views •{" "}
                  {formatDistanceToNow(new Date(video.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
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
