import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(channelId)) {
    throw new APIERROR("Invalid channel ID", 400);
  }

  if (userId.equals(channelId)) {
    throw new APIERROR(400, "You cannot subscribe to your own channel");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new APIERROR("Channel not found", 404);
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubscription) {
    await existingSubscription.deleteOne();
    await User.findByIdAndUpdate(channelId, { $inc: { subscribersCount: -1 } });
    return res.status(200).json(new API(200, "Unsubscribed"));
  } else {
    const newSubscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    await newSubscription.save({ validateBeforeSave: false });
    await User.findByIdAndUpdate(channelId, { $inc: { subscribersCount: 1 } });
    return res
      .status(200)
      .json(new API(200, "Subscribed successfully", newSubscription));
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new APIERROR("Invalid channel ID", 400);
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new APIERROR("Channel not found", 404);
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "name email"
  );

  res.status(200).json({
    status: "success",
    data: {
      subscribers,
      subscribersCount: channel.subscribersCount || 0,
    },
  });
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new APIERROR(400, "Subscriber ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
    throw new APIERROR(400, "Invalid Subscriber ID");
  }

  const subscriber = await User.findById(subscriberId);
  if (!subscriber) {
    throw new APIERROR(404, "Subscriber not found");
  }

  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "username email avatar");

  res.status(200).json({
    status: "success",
    data: {
      subscribedChannels: subscriptions,
    },
  });
});

const fetchSubscriptionStatus = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;

  if (!channelId || !userId) {
    throw new APIERROR(400, "Channel ID and User ID are required");
  }

  if (
    !(
      mongoose.Types.ObjectId.isValid(channelId) &&
      mongoose.Types.ObjectId.isValid(userId)
    )
  ) {
    throw new APIERROR(400, "Invalid Channel ID or User ID");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  res.status(200).json({
    status: "success",
    isSubscribed: !!existingSubscription,
  });
});

const getSubscribedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new APIERROR(400, "User ID is required");
  }

  const subscriptions = await Subscription.find({
    subscriber: userId,
  }).populate("channel", "_id");

  if (!subscriptions.length) {
    return res.status(200).json(new API(200, "No subscriptions found", []));
  }

  const channelIds = subscriptions.map((sub) => sub.channel._id);

  const videos = await Video.aggregate([
    { $match: { channel: { $in: channelIds } } },
    { $sample: { size: 20 } },
  ]);

  res.status(200).json(new API(200, "Subscribed videos", videos));
});

const getChannelVideo = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new APIERROR(400, "Invalid Channel ID");
  }

  const videos = await Video.find({ owner: channelId });

  res.status(200).json({
    status: "success",
    data: {
      videos,
    },
  });
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  fetchSubscriptionStatus,
  getSubscribedVideos,
  getChannelVideo,
};
