import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getUserId, getUsernameById, watcheHistory } from "../../API/index.js";
import { formatDistanceToNow } from "date-fns";
import { useSnackbar } from "notistack";
import useTheme from "../../contexts/theme.js";
import "./watchHist.css";

const WatchHist = () => {
  const [videos, setVideos] = useState([]);
  const [channelInfoMap, setChannelInfoMap] = useState({});
  const [loading, setLoading] = useState(false);
  const { themeMode } = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const formatDuration = (duration) => {
    if (typeof duration !== "number" || duration < 0 || isNaN(duration)) {
      return "0:00";
    }

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const userDataRes = await getUserId();
      const userId = userDataRes?.data?.data?._id;
      
      if (userId) {
        const videoRes = await watcheHistory();
        const videoData = videoRes?.data?.message?.history || [];
        setVideos(videoData);
        console.log("hehehhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",videoData)
      
        const channelIds = videoData
          .map((video) => video?.video?.owner)
          .filter(Boolean);
        const uniqueChannelIds = [...new Set(channelIds)];

        const channelInfoPromises = uniqueChannelIds.map(async (id) => {
          const data = await getUsernameById(id);
          return {
            id,
            username: data?.data?.username,
            avatar: data?.data?.avatar,
          };
        });

        const channelInfoResults = await Promise.all(channelInfoPromises);

        const channelInfoMapResult = {};
        channelInfoResults.forEach(({ id, username, avatar }) => {
          channelInfoMapResult[id] = { username, avatar };
        });

        setChannelInfoMap(channelInfoMapResult);
      }
    } catch (error) {
      enqueueSnackbar("Error fetching watch history videos:", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const sortedVideos = [...videos].sort(
    (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
  );

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div>
      <div className={`feed ${themeMode === "dark" ? "dark" : ""}`}>
        {loading && <p className="loading">Loading...</p>}
        {!loading && sortedVideos.length === 0 && (
          <p className="no-more">No Watch History Available</p>
        )}
        {sortedVideos.map((video) => (
          <Link
            to={`/video/get/${video?.video?._id}`}
            className={`${themeMode === "dark" ? "cardD" : "card"}`}
            key={video._id}
          >
            {console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", video)}
            <div className="thumbnail-container">
              <img
                src={video.video?.thumbnail}
                alt="Img"
                className="thumbnail"
              />
              <div className="video-duration">
                {formatDuration(video?.video?.duration)}
              </div>
            </div>
            <div
              className={`${
                themeMode === "dark" ? "card-contentD" : "card-content"
              }`}
            >
              <div className="flex">
                <img
                  src={
                    channelInfoMap[video?.video?.owner]?.avatar ||
                    "/default-avatar.png"
                  }
                  className="img-pro"
                  style={{ height: "32px", width: "32px" }}
                  alt="channel-img"
                />
                <div>
                  <h2 className="truncate">{video?.video?.title}</h2>
                  <h3 className="truncate">
                    {channelInfoMap[video?.video?.owner]?.username || "Unknown"}
                  </h3>
                  <p>
                    {video?.video?.views} views •{" "}
                    {formatDistanceToNow(new Date(video?.video.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WatchHist;
