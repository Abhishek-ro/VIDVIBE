import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getSubscribedVideos,
  getUserId,
  getUsernameById,
} from "../../API/index.js";
import "./SubscribedFeed.css";
import { formatDistanceToNow } from "date-fns";
import useTheme from "../../contexts/theme.js";
import { SideBar } from "../../components/SideBar/SideBar.jsx";
const SubscribedFeed = ({ sideBar, category, setCategory }) => {
  const [videos, setVideos] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const { themeMode } = useTheme();

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "0:00";

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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
    <>
      <SideBar
        sideBar={sideBar}
        category={category}
        setCategory={setCategory}
      />
      <div className={`feedH ${themeMode === "dark" ? "dark" : ""}`}>
        {videos.length > 0
          ? videos.map((video) => (
              <Link
                to={`/video/get/${video._id}`}
                className={`${themeMode === "dark" ? "cardD" : "card"}`}
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
                      <img
                        src={video.more[1]}
                        className="img-pro"
                        style={{ height: "32px", width: "32px" }}
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
            ))
          : !loading && (
              <p className="no-more">No subscribed videos available.</p>
            )}
        {loading && <p className="loading">Loading...</p>}
      </div>
    </>
  );
};

export default SubscribedFeed;
