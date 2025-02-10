import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router.post("/c/:channelId", toggleSubscription);
router.get("/c/:channelId/subscribers", getUserChannelSubscribers);
router.get("/u/:subscriberId/subscriptions", getSubscribedChannels);


export default router;
