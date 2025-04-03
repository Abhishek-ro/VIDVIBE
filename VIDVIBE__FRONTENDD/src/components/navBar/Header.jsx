import "./Header.css";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search.png";
import upload_icon from "../../assets/upload.png";
import Light from "../../assets/lightMode.png";
import DarkMode from "../../assets/darkmode.png";
import { Link, useNavigate } from "react-router-dom";
import SearchedV from "./SearchedV.jsx";
import { useState, useEffect } from "react";
import {
  getUserId,
  changeUserPassword,
  updateUserDetails,
  updateUserAvatar,
  updateUserCover,
  uploadVideo,
  searchVideos,
  logout,
} from "../../API/index.js";

import useTheme from "../../contexts/theme.js";
let exportedValue;
const NAV_HEADER = ({ setSideBar }) => {
  const [userInfo, setUserInfo] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupPhone, setShowPopupPhone] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateDetails, setShowUpdateDetails] = useState(false); // ✅ New state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [oldFullName, setOldFullName] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [showUpdateAvatar, setShowUpdateAvatar] = useState(false);
  const [newCover, setNewCover] = useState("");
  const [showUpdateCover, setShowUpdateCover] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [videoUpload, setVideoUpload] = useState(null);
  const [thumbnailUpload, setThumbnailUpload] = useState(null);
  const [titleUpload, setTitleUpload] = useState("");
  const [descriptionUpload, setDescriptionUpload] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 556);
  const [sideBarMobile, setSideBarMobile] = useState(false);
  const navigate = useNavigate();

  const { themeMode, darkTheme, lightTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserId();

        if (response.data.data.accessToken === null) return;
        setUserInfo(response.data.data || {});
        setOldFullName(response.data?.fullName || "");
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".user-icon") &&
        !event.target.closest(".user-popup")
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    themeMode === "light" ? darkTheme() : lightTheme();
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setMessage({ type: "error", text: "Both fields are required!" });
      return;
    }

    setLoading(true);
    try {
      const response = await changeUserPassword(oldPassword, newPassword);
      setMessage({ type: "success", text: response?.data?.message });
      setOldPassword("");
      setNewPassword("");
      setShowChangePassword(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password",
      });
    }
    setLoading(false);
  };

  const handleChangeAccountDetails = async () => {
    if (!newFullName) {
      setMessage({ type: "error", text: "Full name is required!" });
      return;
    }

    setLoading(true);
    try {
      const response = await updateUserDetails({ fullName: newFullName });
      setMessage({
        type: "success",
        text: response?.data?.message || "Updated successfully!",
      });
      setOldFullName(newFullName); // ✅ Update UI
      setUserInfo((prev) => ({ ...prev, fullName: newFullName })); // ✅ Update state
      setNewFullName(""); // Reset input field
      setShowUpdateDetails(false); // Close modal
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update details",
      });
    }
    setLoading(false);
  };

  const handleChangeAvatar = async () => {
    if (!newAvatar) {
      setMessage({ type: "error", text: "Please select an image!" });
      return;
    }

    console.log("Selected File:", newAvatar);

    setLoading(true);

    try {
      const response = await updateUserAvatar(newAvatar);

      setUserInfo(response?.data?.data);

      setMessage({ type: "success", text: "Avatar updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (event) => {
    event.preventDefault();
    if (!videoUpload || !descriptionUpload || !titleUpload) {
      setMessage({ type: "error", text: "All fields are required!" });
      return;
    }

    console.log("Selected File:", videoUpload);

    setLoading(true);

    try {
      const response = await uploadVideo(
        videoUpload,
        descriptionUpload,
        titleUpload,
        thumbnailUpload
      );

      console.log("hehehehehehehehehehehehehehehe", response);

      setMessage({ type: "success", text: "Avatar updated successfully!" });
      setShowForm(false);
      setVideoUpload(null);
      setDescriptionUpload("");
      setTitleUpload("");
      setThumbnailUpload(null);
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCoverImg = async () => {
    if (!newCover) {
      setMessage({ type: "error", text: "Please select an image!" });
      return;
    }

    console.log("Selected File:", newCover);

    setLoading(true);

    try {
      const response = await updateUserCover(newCover);

      setUserInfo(response?.data?.data);

      setMessage({ type: "success", text: "Avatar updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setShowConfirmLogout(false);

      await logout();
      localStorage.setItem("accessToken", null);
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleUploadVideo = () => {
    setShowForm(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchVideo();
    }
  };

  const searchVideo = async () => {
    if (!searchQuery.trim()) return;
    try {
      handle(searchQuery);
      navigate(`/video/search?query=${searchQuery}`);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 556);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <div>
        <nav className={`flex-div ${themeMode === "dark" ? "dark" : "light"}`}>
          <div className="nav-left flex-div ">
            <img
              className="menu-icon"
              onClick={() => setSideBar((prev) => !prev)}
              src={menu_icon}
              alt="Menu Icon"
            />
            <Link to="/">
              <img className="logoB" src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="menu-phone">
            <i className="ri-search-line"></i>
            <i
              className="ri-menu-3-line"
              onClick={() => setSideBarMobile((prev) => !prev)}
            ></i>
          </div>
        </nav>

        {sideBarMobile && (
          <div className="sideBarMob">
            <ul>
              <li onClick={() => setShowPopupPhone((prev) => !prev)}>USER</li>
              <li onClick={toggleTheme}>
                {themeMode === "dark" ? "Light Mode" : "Dark Mode"}
              </li>
              <li onClick={() => handleUploadVideo()}>Upload Video</li>
            </ul>
            {showPopupPhone && (
              <div
                className={`${
                  themeMode === "dark" ? "user-popupD" : "user-popup"
                } show`}
              >
                <ul>
                  <li onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </li>
                  <li onClick={() => setShowUpdateDetails(true)}>
                    Update Account Details
                  </li>
                  <li onClick={() => setShowUpdateAvatar(true)}>
                    Update Avatar
                  </li>
                  <li onClick={() => setShowUpdateCover(true)}>
                    Update Cover Image
                  </li>
                  <li
                    className="logout"
                    onClick={() => setShowConfirmLogout(true)}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {showUploadOptions && (
          <div
            className={`${
              themeMode === "dark" ? "upload-optionsD" : "upload-options"
            }`}
          >
            <button onClick={handleUploadVideo}>Upload Video</button>
          </div>
        )}
        {showChangePassword && (
          <div className="overlay">
            <div className="change-password-modal">
              <h2>Change Password</h2>
              {message.text && (
                <p
                  className={
                    message.type === "error"
                      ? "error-message"
                      : "success-message"
                  }
                >
                  {message.text}
                </p>
              )}
              <form>
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="modal-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowChangePassword(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="change-btn"
                    onClick={handleChangePassword}
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showUpdateDetails && (
          <div className="overlay">
            <div className="update-details-modal">
              <h2>Update Account Details</h2>
              {message.text && (
                <p
                  className={
                    message.type === "error"
                      ? "error-message"
                      : "success-message"
                  }
                >
                  {message.text}
                </p>
              )}
              <form>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                />
                <div className="modal-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowUpdateDetails(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="change-btn"
                    onClick={handleChangeAccountDetails}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showUpdateAvatar && (
          <div className="overlay">
            <div className="update-avatar-modal">
              <h2>Update Avatar</h2>
              {message.text && (
                <p
                  className={
                    message.type === "error"
                      ? "error-message"
                      : "success-message"
                  }
                >
                  {message.text}
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewAvatar(e.target.files[0])}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowUpdateAvatar(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="change-btn"
                  onClick={handleChangeAvatar}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpdateCover && (
          <div className="overlay">
            <div className="update-avatar-modal">
              <h2>Update Cover Image</h2>
              {message.text && (
                <p
                  className={
                    message.type === "error"
                      ? "error-message"
                      : "success-message"
                  }
                >
                  {message.text}
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewCover(e.target.files[0])}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowUpdateCover(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="change-btn"
                  onClick={handleChangeCoverImg}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmLogout && (
          <div className="overlay">
            <div className="update-avatar-modal ">
              <h2>Are you sure you want to logout?</h2>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="overlay">
            <div className="upload-container">
              <button className="close-btn" onClick={() => setShowForm(false)}>
                ✖
              </button>
              <h2 className="upload-title">Upload Video</h2>
              <form className="upload-form">
                <input
                  type="text"
                  placeholder="Title"
                  className="input-field"
                  onChange={(e) => setTitleUpload(e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  className="input-field textarea"
                  onChange={(e) => setDescriptionUpload(e.target.value)}
                ></textarea>
                <input
                  type="file"
                  accept="video/*"
                  className="input-file"
                  onChange={(e) => setVideoUpload(e.target.files[0])}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="input-file"
                  onChange={(e) => setThumbnailUpload(e.target.files[0])}
                />
                <button className="upload-btn" onClick={handleAddVideo}>
                  Upload
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <nav
        className={`flex-div ${themeMode === "dark" ? "dark" : "light"}`.trim()}
      >
        {/* Left Section */}
        <div className="nav-left flex-div">
          <img
            className="menu-icon"
            onClick={() => setSideBar((prev) => !prev)}
            src={menu_icon}
            alt="Menu Icon"
          />
          <Link to="/">
            <img className="logoB" src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Middle Section */}
        <div className="nav-middle flex-div">
          <div className="search-box flex-div">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <img src={search_icon} alt="Search Icon" onClick={searchVideo} />
          </div>
        </div>

        {/* Right Section */}
        <div className="nav-right flex-div">
          <img
            src={upload_icon}
            alt="Upload"
            className="upload-icon"
            onClick={() => setShowUploadOptions(!showUploadOptions)}
          />
          <img
            src={themeMode === "dark" ? Light : DarkMode}
            alt="DarkMode"
            className="Dark_icon"
            onClick={toggleTheme}
          />

          {/* User Icon */}
          <img
            src={userInfo?.avatar}
            className="user-icon"
            alt="User Avatar"
            onClick={() => setShowPopup((prev) => !prev)}
          />

          {/* Popup Menu */}
          {showPopup && (
            <div
              className={`${
                themeMode === "dark" ? "user-popupD" : "user-popup"
              } show`}
            >
              <ul>
                <li onClick={() => setShowChangePassword(true)}>
                  Change Password
                </li>
                <li onClick={() => setShowUpdateDetails(true)}>
                  Update Account Details
                </li>
                <li onClick={() => setShowUpdateAvatar(true)}>Update Avatar</li>
                <li onClick={() => setShowUpdateCover(true)}>
                  Update Cover Image
                </li>
                <li
                  className="logout"
                  onClick={() => setShowConfirmLogout(true)}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {showUploadOptions && (
        <div
          className={`${
            themeMode === "dark" ? "upload-optionsD" : "upload-options"
          }`}
        >
          <button onClick={handleUploadVideo}>Upload Video</button>
        </div>
      )}
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="overlay">
          <div className="change-password-modal">
            <h2>Change Password</h2>
            {message.text && (
              <p
                className={
                  message.type === "error" ? "error-message" : "success-message"
                }
              >
                {message.text}
              </p>
            )}
            <form>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowChangePassword(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="change-btn"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Account Details Modal */}
      {showUpdateDetails && (
        <div className="overlay">
          <div className="update-details-modal">
            <h2>Update Account Details</h2>
            {message.text && (
              <p
                className={
                  message.type === "error" ? "error-message" : "success-message"
                }
              >
                {message.text}
              </p>
            )}
            <form>
              <input
                type="text"
                placeholder="Full Name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowUpdateDetails(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="change-btn"
                  onClick={handleChangeAccountDetails}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUpdateAvatar && (
        <div className="overlay">
          <div className="update-avatar-modal">
            <h2>Update Avatar</h2>
            {message.text && (
              <p
                className={
                  message.type === "error" ? "error-message" : "success-message"
                }
              >
                {message.text}
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewAvatar(e.target.files[0])}
            />
            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowUpdateAvatar(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="change-btn"
                onClick={handleChangeAvatar}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateCover && (
        <div className="overlay">
          <div className="update-avatar-modal">
            <h2>Update Cover Image</h2>
            {message.text && (
              <p
                className={
                  message.type === "error" ? "error-message" : "success-message"
                }
              >
                {message.text}
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCover(e.target.files[0])}
            />
            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowUpdateCover(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="change-btn"
                onClick={handleChangeCoverImg}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmLogout && (
        <div className="overlay">
          <div className="update-avatar-modal ">
            <h2>Are you sure you want to logout?</h2>
            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowConfirmLogout(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="overlay">
          <div className="upload-container">
            {/* Close button at top-right */}
            <button className="close-btn" onClick={() => setShowForm(false)}>
              ✖
            </button>

            {/* Upload title centered */}
            <h2 className="upload-title">Upload Video</h2>

            <form className="upload-form">
              <input
                type="text"
                placeholder="Title"
                className="input-field"
                onChange={(e) => setTitleUpload(e.target.value)}
              />
              <textarea
                placeholder="Description"
                className="input-field textarea"
                onChange={(e) => setDescriptionUpload(e.target.value)}
              ></textarea>
              <input
                type="file"
                accept="video/*"
                className="input-file"
                onChange={(e) => setVideoUpload(e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                className="input-file"
                onChange={(e) => setThumbnailUpload(e.target.files[0])}
              />
              <button className="upload-btn" onClick={handleAddVideo}>
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export const handle = (e) => {
  exportedValue = e;
};
export default NAV_HEADER;
export { exportedValue };
