import "./SideBar.css";
import home from "../../assets/home.png";
import sub from "../../assets/sub.png";
import user from "../../assets/user.png";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";
import { getUserId, getSubscribedChannels } from "../../API/index.js";

import useTheme from "../../contexts/theme.js";
export const SideBar = ({ sideBar, category, setCategory }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const { themeMode } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserId();
        const userList = await getSubscribedChannels(data?.data?.data?._id);
        setUserData(userList?.data?.data?.subscribedChannels);
      } catch (error) {
        enqueueSnackbar("SomeThing went wrong,Please Login in again!", {
          variant: "error",
        });
        navigate("/auth")
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`sidebar ${sideBar ? "" : "small-sidebar"} ${
        themeMode === "dark" ? "dark" : ""
      }`}
    >
      <div className="shortcut-links">
        <div
          className={`side-link ${category === 0 ? "active" : ""}`}
          onClick={() => setCategory(0)}
        >
          <img src={home} alt="Home" />
          <p>
            <Link to="/">Home</Link>
          </p>
        </div>
        <div
          className={`side-link ${category === 1 ? "active" : ""}`}
          onClick={() => setCategory(1)}
        >
          <img src={sub} alt="Blogs" />
          <p>
            <Link to="/subscribed">Subscribed</Link>
          </p>
        </div>
        <div
          className={`side-link ${category === 2 ? "active" : ""}`}
          onClick={() => setCategory(2)}
        >
          <img src={user} alt="news" />
          <p>
            <Link to="/u">User</Link>
          </p>
        </div>
        <hr />
      </div>
      <div className="subscribed-list">
        <h3 className="subscribed-listh3">Subscribed</h3>
        {userData.map((data) => (
          <div
            className="side-link"
            key={data?.channel?._id}
            onClick={() =>
              navigate(`/channel/${data?.channel?.username}`, {
                state: { channelData: data?.channel?._id },
              })
            }
          >
            <img src={data?.channel?.avatar} alt="img" />
            <p>{data?.channel?.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
