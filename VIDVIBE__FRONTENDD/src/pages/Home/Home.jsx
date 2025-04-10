import "./Home.css";
import { SideBar } from "../../components/SideBar/SideBar.jsx";
import Feed from "../../components/feed/Feed.jsx";
import SubscribedFeed from "../../components/feed/SubscribedFeed.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import User from "../../components/user/user.jsx"
import useTheme from "../../contexts/theme.js";
const Home = ({ sideBar }) => {
  const [category, setCategory] = useState(0);
  const navigate = useNavigate(); 
  const {themeMode} = useTheme();

  

  return (
    <>
      <SideBar
        sideBar={sideBar}
        category={category}
        setCategory={setCategory}
      />
      <div className={`container ${themeMode==="dark"?"dark":""} ${sideBar ? "" : "large-container"}`}>
        {category === 0 ? (
          <Feed category={category} />
        ) : category === 1 ? (
          <SubscribedFeed
            category={category}
            setCategory={setCategory}
            sideBar={sideBar}
          />
        ) : (
          <User
            category={category}
            setCategory={setCategory}
            sideBar={sideBar}
          />
        )}
      </div>
    </>
  );
};

export default Home;
