import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video", 
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },
    
  },
  { timestamps: true }
);

const View = mongoose.model("View", viewSchema);
export default View;
