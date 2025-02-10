import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
} from "../controllers/like.controllers.js";


const router = Router();

router.use(verifyJWT); 

router.route("/toggle-video-like/:videoId").put(toggleVideoLike);
router.route("/toggle-comment-like/:commentId").put(toggleCommentLike);
router.route("/getLikedVideos/:userId").get(getLikedVideos);
router.route("/toggleTweetLike/:tweetId").put(toggleTweetLike);
export default router; 