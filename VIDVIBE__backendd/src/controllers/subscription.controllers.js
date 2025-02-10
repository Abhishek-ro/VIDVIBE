import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  console.log(channelId);
  const userId = req.user?._id;
  console.log(userId);
  if (!isValidObjectId(channelId)) {
    throw new APIERROR("Invalid channel ID", 400);
  }
  if (
    !(
      mongoose.Types.ObjectId.isValid(channelId) &&
      mongoose.Types.ObjectId.isValid(userId)
    )
  ) {
    throw new APIERROR(400, "Either given ChannelId or User is invalid");
  }
  if (userId.equals(channelId))
    throw new APIERROR(400, "You cannot subscribe to your own channel");
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
    return res.status(200).json(new API(200, "UnSubscribe"));
  } else {
    const newSubscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new API(200, "Subscribed successfully", newSubscription));
  }
});


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new APIERROR(400, "ChannelId Not Found!!!");
  }

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

  if (!subscribers.length) {
    return res.status(200).json({
      status: "success",
      message: "No subscribers found for this channel.",
      data: { subscribers: [] },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      subscribers,
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
  }).populate(
    "channel", 
    "name email" 
  );
  res.status(200).json({
    status: "success",
    data: {
      subscribedChannels: subscriptions,
    },
  });
});


export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
