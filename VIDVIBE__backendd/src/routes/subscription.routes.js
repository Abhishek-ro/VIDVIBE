import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  fetchSubscriptionStatus,
  getSubscribedVideos,
  getChannelVideo,
} from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router.post("/c/:channelId", toggleSubscription);
router.get("/c/:channelId/subscribers", getUserChannelSubscribers);
router.get("/u/:subscriberId/subscriptions", getSubscribedChannels);
router.get("/c/:channelId/status", fetchSubscriptionStatus); 
router.get("/subscribed/videos",getSubscribedVideos);
router.get("/channel/:channelId/videos",getChannelVideo);
export default router;
