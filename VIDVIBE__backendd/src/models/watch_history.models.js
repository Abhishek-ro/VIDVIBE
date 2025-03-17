import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    videos: [
      {
        video: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video",
          required: true,
        },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // Adds createdAt & updatedAt fields automatically
);

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);


