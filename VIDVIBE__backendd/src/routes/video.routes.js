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
  fetchSubscriptionVideos,
} from "../controllers/video.controllers.js";
import { addView, getTotalViews } from "../controllers/views.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/get-all-home").get(getAllHomeVideo);
router.route("/get-all").get(getAllVideos);


router.route("/get/:videoId").get(getVideoById);
router.route("/add-view/:videoId").post(addView);
router.route("/update/:videoId").put(updateVideo);
router.route("/delete/:videoId").delete(deleteVideo);
router.route("/toggle-publish-status/:videoId").put(togglePublishStatus);

router.route("/subscribed/videos").get(fetchSubscriptionVideos);
router.route("/views/:videoId").post(getTotalViews);

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

export default router;
