import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllHomeVideo,
} from "../controllers/video.controllers.js";

const router = Router();

router.use(verifyJWT);
router.route("/get-all-home").get(getAllHomeVideo);
router.route("/get-all").get(getAllVideos)
router.route("/get/:videoId").get(getVideoById)
router.route("/update/:videoId").put(updateVideo)
router.route("/delete/:videoId").delete(deleteVideo)
router.route("/toggle-publish-status/:videoId").put(togglePublishStatus)
router.route("/publish").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxcount: 1,
    },
    {
      name: "thumbnail",
      maxcount: 1,
    },
  ]),
  publishAVideo
);
export default router