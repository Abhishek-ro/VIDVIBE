import axios from "axios"


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});


export const login = async (data) =>
  await api.post("/api/v1/user/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", 
    },
  });

export const register = (data) => api.post("/api/v1/user/register", data);
export const getUserData = () => api.get("/api/v1/user/current-user");