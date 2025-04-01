import "./App.css";
import Home from "./pages/Home/Home.jsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import NAV_HEADER from "./components/navBar/Header.jsx";
import { Video } from "./pages/Video/Video.jsx";
import { useState } from "react";
import Auth from "./pages/Auth.jsx";
import ChannelData from "./components/feed/channelData.jsx";
import SubscribedFeed from "./components/feed/SubscribedFeed.jsx";
import User from "./components/user/user.jsx";
import LikedVideoNextPage from "./components/userNextData/LikedVideoNextPage.jsx";
import WatchHist from "./components/user/watchHist.jsx";
import SearchResults from "./components/navBar/SearchedV.jsx";
import {ThemeProvider} from "./contexts/theme.js"
import YourVideos from "./components/user/YourVideos.jsx";
import LikedVideo from "./components/user/LikedVideo.jsx";
function App() {
  const [sideBar, setSideBar] = useState(true);
  const location = useLocation();
   const [themeMode, setThemeMode] = useState("dark");

   const darkTheme = () => setThemeMode("dark");
   const lightTheme = () => setThemeMode("light");

  return (
    <div>
      <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
        {/* Show Navbar only if the path is NOT "/auth" */}
        {location.pathname !== "/auth" && (
          <NAV_HEADER setSideBar={setSideBar} />
        )}

        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home sideBar={sideBar} />}>
            <Route
              path="subscribed"
              element={<SubscribedFeed sideBar={sideBar} />}
            />
            <Route path="u" element={<User sideBar={sideBar} />}></Route>
          </Route>
          <Route path="/u/liked-videos" element={<LikedVideoNextPage />} />
          {/* <Route path="/u/watch-history" element={<WatchHistory />} /> */}
          <Route path="/your-videos" element={<YourVideos />} />
          <Route path="/liked-videos" element={<LikedVideo />} />
          <Route path="/watch-history" element={<WatchHist />} />
          <Route path="/video/search" element={<SearchResults />} />
          <Route path="/channel/:channelId" element={<ChannelData />} />
          <Route path="/video/get/:videoId" element={<Video />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
