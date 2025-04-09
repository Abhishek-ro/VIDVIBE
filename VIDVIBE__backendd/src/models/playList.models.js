


import mongoose , {Schema} from "mongoose"

const playlistsSchema = new Schema(
  {
    video: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    name: {
      type: String,
      requried: true,
    },
    description: {
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

export const Playlist = mongoose.model("Playlist", playlistsSchema);