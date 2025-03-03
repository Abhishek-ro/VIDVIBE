import "./Home.css";
import { VideosList } from "./AllVideo.jsx";
function Home() {
  return (
    <>
      <div className="side_col">
        <div className="home_icon">
          <img src="./src/assets/HOME_ICON.png" alt="Home" />
          <span>Home</span>
        </div>
        <div className="subscription">
          <img src="./src/assets/SubScription.png" alt="Subscriptions " />
          <span>Subscription</span>
        </div>
        <div className="user_profile">
          <img src="./src/assets/user.png" alt="user-Profile" />
          <span>You</span>
        </div>
      </div>
      <div>
        <h1 className="content">
          <VideosList />
        </h1>
      </div>
    </>
  );
}

export default Home;
