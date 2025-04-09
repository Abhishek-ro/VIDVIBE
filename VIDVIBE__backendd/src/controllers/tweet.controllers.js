import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      throw new APIERROR(400, "Tweet content cannot be empty");
    }

    const userId = req.user?._id;

    if (!userId) {
      throw new APIERROR(401, "User not authenticated");
    }

    const tweet = await Tweet.create({
      content,
      owner: userId,
    });

    res.status(201).json(new API(201, "Tweet created successfully", { tweet }));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new APIERROR(400, "User ID is required");
    }

    if (!isValidObjectId(userId)) {
      throw new APIERROR(400, "Invalid User ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIERROR(404, "User not found");
    }

    const tweets = await Tweet.find({ owner: userId }).sort({
      createdAt: -1,
    });

    if (!tweets.length) {
      return res
        .status(200)
        .json(new API(200, "No tweets found for this user", { tweets: [] }));
    }

    res
      .status(200)
      .json(new API(200, "User tweets retrieved successfully", { tweets }));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { content } = req.body;
    if (!tweetId) throw new APIERROR(400, "Tweet ID is required");

    if (!isValidObjectId(tweetId)) throw new APIERROR(400, "Invalid Tweet ID");

    if (!content || content.trim() === "")
      throw new APIERROR(400, "Content is required to update the tweet");

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) throw new APIERROR(404, "Tweet not found");

    if (!tweet.owner.equals(req.user._id))
      throw new APIERROR(403, "Unauthorized to update this tweet");

    tweet.content = content;

    const updatedTweet = await tweet.save();

    res
      .status(200)
      .json(new API(200, "Tweet updated successfully", { updatedTweet }));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) throw new APIERROR(400, "Tweet ID is required");

    if (!isValidObjectId(tweetId)) throw new APIERROR(400, "Invalid Tweet ID");

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) throw new APIERROR(404, "Tweet not found");

    if (!tweet.owner.equals(req.user._id))
      throw new APIERROR(403, "Unauthorized to delete this tweet");

    await tweet.deleteOne();

    res.status(200).json(new API(200, "Tweet deleted successfully"));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
