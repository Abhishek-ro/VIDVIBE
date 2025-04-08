import "../../pages/Auth.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../API/index.js";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerMutation = useMutation({
    mutationFn: (reqData) => register(reqData),
    onSuccess: (res) => {
      const { message } = res.data; // Assuming your backend sends a message
      const { email } = formData; // Get the registered email

      enqueueSnackbar(
        message ||
          "Registration successful! Please check your email to verify your account.",
        {
          variant: "success",
        }
      );

      // Store the email temporarily (you might use a different identifier)
      localStorage.setItem("verificationEmail", email);

      // Redirect to the verification page
      navigate("/verify");
    },
    onError: (err) => {
      console.log("SOMETHING'S WRONG!!!", err);
      const errorMessage =
        err.response?.data?.message || "Registration failed! Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="all-input-box">
          <label className="label-name">Username</label>
          <div className="input-label">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <label className="label-name">fullname</label>
          <div className="input-label">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your fullname"
            />
          </div>

          <label className="label-name">email</label>
          <div className="input-label">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <label className="label-name">password</label>
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
          <button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};
