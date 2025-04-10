import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

export const getVideos = async (offset = 0, limit = 8) => {
  const token = localStorage.getItem("token");
  console.log("token", token);
  // eslint-disable-next-line no-undef
  return api.get(`${process.env.VITE_BACKEND_URL}/api/v1/video/get-all`, {
    params: { offset, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const login = async (data) =>
  await api.post("/api/v1/user/login", data);
  


export const register = (data) => api.post("/api/v1/user/register", data);


export const getUserData = () => {
  const token = localStorage.getItem("token"); 

  return api.get("/api/v1/user/current-user", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};
