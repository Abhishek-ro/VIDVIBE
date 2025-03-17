import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getUserId,
  getVideoById,
  getUsernameById,
  getTotalLikes,
  toggleVideoLike,
  getViews,
  handleAddView,
  addComment,
  allComments,
  totalCommentNumber,
  getChannelSubscribers,
  fetchSubscriptionStatus, // ✅ Create a new function for fetching subscription status
  isSubscribedToggle, // ✅ This should only be used for toggling
} from "../../API/index.js";
import "./PlayVideo.css";
import Like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";

const timeAgo = (timestamp) => {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
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

export const PlayVideo = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [like, setLike] = useState(0);
  const [views, setViews] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [allComment, setAllComment] = useState([]);
  const [pageC, setPageC] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCountOfComment, setTotalCountOfComment] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [totalSubs, setTotalSub] = useState(0);
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setAllComment([]);
        setPageC(0);

        const data = await getUserId();
        setUserId(data.data.data._id);

        const res = await getVideoById(videoId);
        const videoData = res?.data?.message?.video;
        setVideo(videoData);

        const totalSubsDisplay = await getChannelSubscribers(videoData?.owner)
        console.log("Total", totalSubsDisplay?.data?.data?.subscribers?.length);
        setTotalSub(totalSubsDisplay?.data?.data?.subscribers?.length);
        await handleAddView(videoId);
        const totalViews = await getViews(videoId);
        setViews(totalViews?.data.totalViews);

        const totalLikesRes = await getTotalLikes(videoId);
        setLike(totalLikesRes?.data?.data || 0);

        const channelRes = await getUsernameById(videoData?.owner);
        setChannel(channelRes.data.username);

        // ✅ Fetch Subscription Status using a separate API function
        const subscriptionRes = await fetchSubscriptionStatus(videoData?.owner);
        setIsSubscribed(subscriptionRes?.data?.isSubscribed); // Assume API returns `true` or `false`

        loadComments(0);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();   
  }, [videoId]);

  const handleSubscribeToggle = async () => {
  try {
    const response = await isSubscribedToggle(video.owner);
    console.log("Subscription Response:", response);

    // ✅ Toggle subscription status
    setIsSubscribed((prev) => !prev);

    // ✅ Immediately update the subscriber count based on action
    setTotalSub((prev) => (isSubscribed ? prev - 1 : prev + 1));
  } catch (error) {
    console.error("Error toggling subscription:", error);
  }
};


  const loadComments = async (page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await allComments(videoId, page, 5);
      const newComments = res?.data?.comments || [];

      if (newComments.length === 0) {
        setHasMore(false);
      } else {
        setAllComment((prev) => [...prev, ...newComments]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchTotalComments = async () => {
      try {
        const total = await totalCommentNumber(videoId);
        setTotalCountOfComment(total.data.comments);
      } catch (error) {
        console.error("Error fetching total comments:", error);
      }
    };
    fetchTotalComments();
  }, [videoId]);

  useEffect(() => {
    if (pageC > 0) {
      loadComments(pageC);
    }
  }, [pageC]);

  const addLike = async () => {
    try {
      const res = await toggleVideoLike(videoId);
      setLike((prev) =>
        res?.data?.message === "Video liked successfully"
          ? prev + 1
          : Math.max(0, prev - 1)
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await addComment(videoId, commentText);
      const newComment = res?.data?.comment;
      if (newComment) {
        setAllComment((prev) => [newComment, ...prev]);
      }
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  useEffect(() => {
    console.log("TotalSub", totalSubs);
  }, [totalSubs]);

  if (!video || !channel) return <p>Loading...</p>;
  
  return (
    <div className="play-video">
      <video src={video.videoFile} controls autoPlay muted></video>
      <h3>{video.title}</h3>
      <div className="play-video-info">
        <p>
          {views} Views &bull; {timeAgo(video.createdAt)}
        </p>
        <div className="flex-div">
          <span>
            <img src={Like} alt="Like" onClick={addLike} /> {like}
          </span>
          <span>
            <img src={dislike} alt="Dislike" />
          </span>
          <span>
            <img src={share} alt="Share" /> Share
          </span>
          <span>
            <img src={save} alt="Save" /> Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <div>
          <div className="inline-box">
            <img src={channel.avatar} />
          </div>
          <p>{channel.username}</p>
          <span>{totalSubs || 0} Subscribers</span>
        </div>
        <button
          className={isSubscribed ? "subscribed" : ""}
          onClick={handleSubscribeToggle}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      <div className="vid-description">
        <p>{video.description}</p>
        <hr />
        <h3>{totalCountOfComment} Comments</h3>

        <div className="comment-input">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Comment</button>
        </div>

        {allComment.map((comment) => (
          <div className="comment" key={comment._id}>
            <div>
              <img src={comment?.owner?.avatar} />
              <h3>{comment.owner.username}</h3>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && <p>Loading more comments...</p>}
    </div>
  );
};
