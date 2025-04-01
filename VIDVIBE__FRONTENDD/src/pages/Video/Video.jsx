import {React} from 'react'
import "./Video.css"
import { PlayVideo } from '../../components/playVideo/PlayVideo.jsx'
import  Recommended  from "../../components/recommended/Recommended.jsx";
import useTheme from "../../contexts/theme.js";
export const Video = () => {
  const {themeMode} = useTheme();
  return (
    <div
      className={`${
        themeMode === "dark" ? "play-containerD" : "play-container"
      }`}
    >
      <PlayVideo />
      <Recommended />
    </div>
  );
}
