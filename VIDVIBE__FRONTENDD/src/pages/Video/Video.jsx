import {React} from 'react'
import "./Video.css"
import { PlayVideo } from '../../components/playVideo/PlayVideo.jsx'
import  Recommended  from "../../components/recommended/Recommended.jsx";
export const Video = () => {
  return (
    <div className="play-container">
      <PlayVideo />
      <Recommended />
    </div>
  );
}
