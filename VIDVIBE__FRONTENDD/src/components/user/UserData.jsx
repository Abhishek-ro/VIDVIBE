import { useEffect, useState } from "react";
import { getUserId, getYourVideos } from "../../API/index.js";
import "./UserData.css";
import useTheme from "../../contexts/theme.js";
import { useSnackbar } from "notistack";
const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [vidLen, setVidLen] = useState(0);
  const { themeMode } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserId();
        const dar = await getYourVideos();
        setVidLen(dar?.data?.message?.videos?.length);

        setUserData(data?.data?.data);
      } catch (error) {
        enqueueSnackbar("Error fetching user data", {
          variant: "error",
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`${themeMode==="dark"?"user-containerD":"user-container"}`}>
      {userData ? (
        <>
          <img src={userData.coverImage} alt="Cover" className="user-image" />
          <div className="user-info">
            <img src={userData.avatar} alt="Avatar" className="user-avatar" />
            <div className="user-details">
              <span className="full-name">{userData.fullName}</span>
              <div className="username-row">
                <span className="username">{userData.username}</span>
                <span className="separator">•</span>
                <span className="subscribers">
                  {userData.subscribersCount} subscribers
                </span>
                <span className="separator">
                  • {vidLen} {vidLen > 1 ? "videos" : "video"}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserData;
