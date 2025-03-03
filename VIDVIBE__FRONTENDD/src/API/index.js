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



export const register = (data) => api.post("/api/v1/user/register", data);
export const getUserData = () => api.get("/api/v1/user/current-user");

// 🔹 Videos API
export const getVideos = () =>
  api.get("/api/v1/video/get-all?limit=${limit}&offset=${offset}");
export const getUsernameById = (id) =>  api.get(`/api/v1/user/getUsernameById/${id}`);

export default api;
