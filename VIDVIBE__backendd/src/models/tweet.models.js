// tweets [icon: twitter] {
//   id string pk
//   owner ObjectId users
//   content string
//   createdAt Date
//   updatedAt Date  
// }





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
