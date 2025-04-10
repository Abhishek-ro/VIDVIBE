import "../../pages/Auth.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../API/index.js";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      const {  accessToken } = res.data.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        enqueueSnackbar("Login Successful!", { variant: "success" });
        navigate("/");
      } else {
        enqueueSnackbar("Login failed! No token received.", {
          variant: "error",
        });
      }
    },
    onError: (err) => {
      console.log("SOMETHING'S WRONG!!!");
      const errorMessage =
        err.response?.data?.message || "Login failed! Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="all-input-box">
          <label htmlFor="username" className="label-name">
            Username
          </label>
          <div className="input-label">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <label htmlFor="email" className="label-name">
            Email
          </label>
          <div className="input-label">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <label htmlFor="password" className="label-name">
            Password
          </label>
          <div className="input-label">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <br />
          <button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};
