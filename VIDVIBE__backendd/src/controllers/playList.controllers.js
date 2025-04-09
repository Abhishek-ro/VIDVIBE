import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playList.models.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "")
      throw new APIERROR(400, "Playlist name is required");

    const playlist = await Playlist.create({
      name,
      description,
      owner: req.user._id,
    });

    res
      .status(201)
      .json(new API(201, "Playlist created successfully", { playlist }));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) throw new APIERROR(400, "User ID is required");

    if (!isValidObjectId(userId)) throw new APIERROR(400, "Invalid User ID");

    const playlists = await Playlist.find({ owner: userId });

    if (!playlists || playlists.length === 0) {
      throw new APIERROR(404, "No playlists found for this user");
    }

    res
      .status(200)
      .json(
        new API(200, "User playlists retrieved successfully", { playlists })
      );
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
      throw new APIERROR(400, "Invalid or missing Playlist ID");
    }

    const playlist = await Playlist.findById(playlistId).populate("video");

    if (!playlist) {
      throw new APIERROR(404, "Playlist not found");
    }

    res
      .status(200)
      .json(new API(200, "Playlist retrieved successfully", { playlist }));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
      throw new APIERROR(400, "Invalid or missing Playlist ID");
    }

    if (!videoId || !isValidObjectId(videoId)) {
      throw new APIERROR(400, "Invalid or missing Video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new APIERROR(404, "Playlist not found");
    }

    if (playlist.video.includes(videoId)) {
      throw new APIERROR(400, "Video already exists in the playlist");
    }

    playlist.video.push(videoId);
    await playlist.save();

    res
      .status(200)
      .json(new API(200, "Video added to playlist successfully", { playlist }));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
      throw new APIERROR(400, "Invalid or missing Playlist ID");
    }

    if (!videoId || !isValidObjectId(videoId)) {
      throw new APIERROR(400, "Invalid or missing Video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new APIERROR(404, "Playlist not found");
    }

    const videoIndex = playlist.video.indexOf(videoId);

    if (videoIndex === -1) {
      throw new APIERROR(400, "Video not found in the playlist");
    }

    playlist.video.splice(videoIndex, 1);
    await playlist.save();

    res
      .status(200)
      .json(
        new API(200, "Video removed from playlist successfully", { playlist })
      );
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
      throw new APIERROR(400, "Invalid or missing Playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new APIERROR(404, "Playlist not found");
    }

    await playlist.deleteOne();

    res.status(200).json(new API(200, "Playlist deleted successfully"));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId || !isValidObjectId(playlistId)) {
      throw new APIERROR(400, "Invalid or missing Playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new APIERROR(404, "Playlist not found");
    }

    if (name) playlist.name = name;
    if (description) playlist.description = description;

    const updatedPlaylist = await playlist.save({ validateBeforeSave: true });

    res
      .status(200)
      .json(new API(200, "Playlist updated successfully", { updatedPlaylist }));
  } catch (error) {
    throw new APIERROR(500, error.message);
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
