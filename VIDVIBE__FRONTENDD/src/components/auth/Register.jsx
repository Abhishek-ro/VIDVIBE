import "../../pages/Auth.css";
import { useState } from "react";
export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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
          <button type="submit">SIGN UP</button>
        </div>
      </form>
    </div>
  );
};
