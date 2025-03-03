import {
  registerUser,
  logoutUser,
  loginUser,
  changePassword,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  getUsernameById,
} from "../controllers/user.controllers.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxcount: 1,
    },
    {
      name: "coverImage",
      maxcount: 1
    },
  ]),
  registerUser
);



router.route("/getUsernameById/:id").get(getUsernameById);
router.route("/login").post(loginUser);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/channel-profile/:username").get(getUserChannelProfile);
// secure routes


router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account-details").post(verifyJWT, updateAccountDetails);
router.route("/update-user-avatar").post(
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);
router.route("/update-user-cover-image").post(
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);
router.route("/watch-history").get(verifyJWT, getWatchHistory); 
export default router