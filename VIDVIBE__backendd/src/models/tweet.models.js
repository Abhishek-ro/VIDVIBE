import mongoose , {Schema} from "mongoose"

const tweetsSchema = new Schema(
  {
    
    content: {
      type: String,
      requried: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Tweet = mongoose.model("Tweet", tweetsSchema);
