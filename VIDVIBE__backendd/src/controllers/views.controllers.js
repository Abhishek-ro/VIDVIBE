import View from "../models/views.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {Video} from "../models/video.models.js";
const addView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user ? req.user.id : null;


  if (userId) {
    const existingView = await View.findOne({ video: videoId, user: userId });

    if (existingView) {
      return res
        .status(200)
        .json({ success: true, message: "View already counted" });
    }
  }

  await View.create({ video: videoId, user: userId });
  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  res.status(201).json({ success: true, message: "View added successfully" });
});

const getTotalViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const totalViews = await View.countDocuments({ video: videoId });

  res.status(200).json({ success: true, totalViews });
});

export { addView, getTotalViews };
