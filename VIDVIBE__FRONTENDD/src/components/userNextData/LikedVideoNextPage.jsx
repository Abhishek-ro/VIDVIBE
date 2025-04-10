import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { likedVideos, getUsernameById } from "../../API/index.js";
import "./LikedVideoNextPage.css";
import { useSnackbar } from "notistack";

const LikedVideoNextPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchLikedVideos = async () => {
      setLoading(true);
      try {
        const response = await likedVideos();

        let videoData = response?.data?.data || [];
        console.log(videoData);

        for (let video of videoData) {
          console.log(video?.video?.username);
        }

        setVideos(videoData);
      } catch (error) {
        enqueueSnackbar("Error fetching liked videos", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="feed">
      {loading && <p className="loading">Loading...</p>}
      {!loading && videos.length === 0 && (
        <p className="no-more">No liked videos found.</p>
      )}

      {videos.map((video) => (
        <Link to={`/video/get/${video._id}`} className="card" key={video._id}>
          <div className="thumbnail-container">
            <img src={video.thumbnail} alt={video.title} />
          </div>
          <div className="card-content">
            <h2 className="truncate">{video.title}</h2>
            <h3 className="truncate">{video.username}</h3>
            <p>
              {video.views} views •{" "}
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LikedVideoNextPage;
