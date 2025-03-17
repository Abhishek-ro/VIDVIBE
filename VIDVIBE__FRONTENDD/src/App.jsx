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
import ChannelData from "./components/feed/channelData.jsx"
function App() {
  const [sideBar, setSideBar] = useState(true);
  const location = useLocation(); // Get current path dynamically

  return (
    <div>
      {/* Show Navbar only if the path is NOT "/auth" */}
      {location.pathname !== "/auth" && <NAV_HEADER setSideBar={setSideBar} />}

      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home sideBar={sideBar} />} />
        <Route
          path="/channel/:channelId"
          element={<ChannelData />}
        />
        <Route path="/video/get/:videoId" element={<Video />} />
      </Routes>
    </div>
  );
}

export default App;
