import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Loader from "../Loader/Loader.jsx";
import { useSnackbar } from "notistack";

import {
  getVideos,
  getSubscribedVideos,
  getUsernameById,
  getUserId,
} from "../../API/index.js";
import "./Feed.css";
import useTheme from "../../contexts/theme.js";
const Feed = ({ category }) => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const limit = 16;
  const { themeMode } = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const fetchVideos = useCallback(
    async (pageNumber = 0, reset = false) => {
      if (!hasMore || loading) return;
      setLoading(true);
      if (loading) {
        return <Loader />;
      }

      try {
        const userData = await getUserId();
        const userId = userData?.data?.data?._id;
        if (!userId) {
          enqueueSnackbar("User not found. Please log in again.", {
            variant: "error",
          });
          localStorage.removeItem("accessToken");
          navigate("/auth")
     
          return;
        }
        let videoData = [];
        if (category === 0) {
          const res = await getVideos(limit, pageNumber);
          videoData = res?.data?.videos || [];
        } else if (category === 1 && userId) {
          const subRes = await getSubscribedVideos(userId);
          videoData = subRes?.data?.data || [];
        }

        if (videoData.length === 0) {
          setHasMore(false);
          return;
        }

        setHasMore(videoData.length >= limit);

        const updatedVideos = await Promise.all(
          videoData.map(async (video) => {
            try {
              const userRes = await getUsernameById(video.owner);

              return {
                ...video,
                username: userRes?.data?.username?.username || "Unknown",
              };
            } catch (error) {
              console.error(
                `Failed to fetch username for owner ${video.owner}:`,
                error
              );
              return { ...video, username: "Unknown" };
            }
          })
        );

        setVideos((prev) =>
          reset ? updatedVideos : [...prev, ...updatedVideos]
        );
        setPage((prev) => (reset ? limit : prev + limit));
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    },
    [category, hasMore, loading]
  );

  const formatDuration = (duration) => {
    if (typeof duration !== "number" || duration < 0 || isNaN(duration)) {
      return "0:00";
    }

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    setVideos([]);
    setPage(0);
    setHasMore(true);
    fetchVideos(0, true);
  }, [category]);

  useEffect(() => {
    if (!hasMore || loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchVideos(page);
    });

    const lastVideo = document.querySelector(".feedH .card:last-child");
    if (lastVideo) observer.observe(lastVideo);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [videos, hasMore, loading, fetchVideos]);

  return (
    <div className={`feedH ${themeMode === "dark" ? "dark" : "light"}`}>
      {videos.map((video) => (
        <Link
          to={`/video/get/${video._id}`}
          className={themeMode === "dark" ? "cardD" : "card"}
          key={video._id}
        >
          <div className="thumbnail-container">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="thumbnail"
            />
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
                <img src={video.more[1]} className="img-pro" alt="chn-img" />
              </div>
              <div className="Width-det">
                <h2 className="truncate">
                  {video.title.length > 43
                    ? video.title.substring(0, 40) + "..."
                    : video.title}
                </h2>

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

export default Feed;
