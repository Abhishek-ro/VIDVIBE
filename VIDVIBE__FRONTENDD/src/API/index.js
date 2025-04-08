import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const accessToken = (userId) =>
  api.post("/api/v1/user/generate-access-token", { userId });

export const login = (data) => api.post("/api/v1/user/login", data);
export const register = (data) => api.post("/api/v1/user/register", data);
export const getUserData = () => api.get("/api/v1/user/current-user");
export const verifyEmail = (data) =>
  api.post("/api/v1/user/verify-email", data);
// 🔹 Videos API
export const getVideos = (limit, offset) =>
  api.get(`/api/v1/video/get-all?limit=${limit}&offset=${offset}`);
export const getUsernameById = (id) =>
  api.get(`/api/v1/user/getUsernameById/${id}`);
export const getVideoById = (id) => api.get(`/api/v1/video/get/${id}`);

export const deleteVideo = (id) => api.delete(`/api/v1/video/delete/${id}`);
export const toggleVideoVisibility = (id) =>
  api.put(`/api/v1/video/toggle-publish-status/${id}`);


export const updateVideo = async (videoId, updateDetails) => {
  try {
    const formData = new FormData();

    if (updateDetails.title) formData.append("title", updateDetails.title);
    if (updateDetails.description)
      formData.append("description", updateDetails.description);
    if (updateDetails.thumbnail)
      formData.append("thumbnail", updateDetails.thumbnail);

    const response = await api.put(
      `/api/v1/video/update/${videoId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // ✅ Returns response data for better handling in frontend
  } catch (error) {
    console.error(
      "Error updating video:",
      error?.response?.data || error.message
    );
    throw error; // ✅ Ensures errors are properly caught and handled in the frontend
  }
};





// 🔹 Likes API
export const toggleVideoLike = (videoId) =>
  api.put(`/api/v1/like/toggle-video-like/${videoId}`);
export const toggleCommentLike = (commentId) =>
  api.put(`/api/v1/like/toggle-comment-like/${commentId}`);
export const getLikedVideos = (userId) =>
  api.get(`/api/v1/like/getLikedVideos/${userId}`);
export const toggleTweetLike = (tweetId) =>
  api.put(`/api/v1/like/toggleTweetLike/${tweetId}`);
export const getTotalLikes = (videoId) =>
  api.get(`/api/v1/like/getTotalLikes/${videoId}`);

// 🔹 Views API
export const getViews = (videoId) => api.post(`/api/v1/video/views/${videoId}`);
export const handleAddView = async (videoId) => {
  try {
    await api.post(`/api/v1/video/add-view/${videoId}`);
  } catch (error) {
    console.error("Error adding view:", error);
  }
};

// 🔹 Comments API
export const addComment = (videoId, text) =>
  api.post(`/api/v1/comment/${videoId}`, { text });
export const allComments = (videoId, page = 0, limit = 10) =>
  api.get(`/api/v1/comment/${videoId}?page=${page}&limit=${limit}`);
export const totalCommentNumber = (videoId) =>
  api.get(`/api/v1/comment/${videoId}/total`);
export const updateComments = (commentId, text) =>
  api.post(`/api/v1/comment/${commentId}`, { text });
export const deleteComment = (commentId) =>
  api.delete(`/api/v1/comment/${commentId}`);
export const getUserId = () => api.get(`/api/v1/user/current-user`);

// 🔹 Subscriptions API
export const isSubscribedToggle = (channelId) =>
  api.post(`/api/v1/subscription/c/${channelId}`);
export const getSubscribedChannels = (subscriberId) =>
  api.get(`/api/v1/subscription/u/${subscriberId}/subscriptions`);
export const getChannelSubscribers = (channelId) =>
  api.get(`/api/v1/subscription/c/${channelId}/subscribers`);

// ✅ Fetch Subscription Status
export const fetchSubscriptionStatus = (channelId) =>
  api.get(`/api/v1/subscription/c/${channelId}/status`);



export const changeUserPassword = (oldPassword, newPassword) =>
  api.post("/api/v1/user/change-password", { oldPassword, newPassword });

export const updateUserDetails=(data)=>api.post("/api/v1/user/update-account-details",data)
export const updateUserAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file); // Ensure the key matches multer's field name

  return api.post("/api/v1/user/update-user-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getSubscribedVideos = () => api.get("/api/v1/video/subscribed/videos");
export const updateUserCover = (file) => {
  const formData = new FormData();
  formData.append("coverImage", file); 

  return api.post("/api/v1/user/update-user-cover-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const uploadVideo = (videoFile, description, titleUpload,thumbnailUpload) => {
  const formData = new FormData();
  formData.append("videoFile", videoFile);
  if (thumbnailUpload) {
    formData.append("thumbnail", thumbnailUpload);
  }

  formData.append("title", titleUpload);
  formData.append("description", description);
  return api.post("/api/v1/video/publish", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
// users Liked Videos

export const likedVideos=()=>api.get("/api/v1/like/getLikedVideos")
export const watcheHistory=()=>api.get("/api/v1/user/watch-history")
export const getYourVideos=()=>api.get("/api/v1/user/user-videos")
export const getChannelVideos = (channelId) =>
  api.get(`/api/v1/subscription/channel/${channelId}/videos`);
export const searchVideos = (searchQuery) =>
  api.get(`/api/v1/video/video/search?query=${searchQuery}`);
export const logout = () => api.post("/api/v1/user/logout");
export default api;
