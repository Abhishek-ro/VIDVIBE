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
      ref: "User", // Reference to the User model (optional for anonymous users)
      default: null,
    },
    
  },
  { timestamps: true }
);

const View = mongoose.model("View", viewSchema);
export default View;
