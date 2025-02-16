/* eslint-disable no-undef */
import { asyncHandler } from "../utils/AsyncHandler.js";
import { APIERROR } from "../utils/APIError.js";
import { API } from "../utils/APIResponses.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { deleteFileFromLocalPath } from "../middlewares/multer.middlewares.js";

import jwt from "jsonwebtoken";
import { mongoose } from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new APIERROR(404, "User Not Found!!!");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new APIERROR(500, "Something went wrong while generating tokens!!!",error);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  console.log({ fullName, username, email, password });

  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new APIERROR(400, "All Fields Are Required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    deleteFileFromLocalPath(req.files?.avatar?.[0]?.path);
    deleteFileFromLocalPath(req.files?.coverImage?.[0]?.path);
    throw new APIERROR(403, "User Already Exist!!!");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new APIERROR(404, "Avatar Not Found!!!");
  }
  let avatar = "";
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  } catch (error) {
    throw new APIERROR(500, "Something went Wrong while uploading Avatar!!!",error);
  }

  let coverImage = "";
  if (coverLocalPath) {
    coverImage = await uploadOnCloudinary(coverLocalPath);
  }

  try {
    const user = await User.create({
      username,
      avatar: avatar.url,
      coverImage: coverImage.url || "",
      fullName,
      email,
      password,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    console.log(createdUser._id);

    if (!createdUser._id) {
      throw new APIERROR(500, "Something went Wrong while registering user!!!");
    }

    return res
      .status(200)
      .json(new API(201, createdUser, "User Register Successfully!!"));
  } catch (error) {
    console.log(error);
    if (avatar) await deleteFromCloudinary(avatar.public_id);

    if (coverImage) await deleteFromCloudinary(coverImage.public_id);
    throw new APIERROR(
      500,
      "Something went wrong will uploading the images and images where deleted!!"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email && !username)
    throw new APIERROR(400, "Email or User is required!!!");
  if (!password) throw new APIERROR(400, "Password is Required!!!");

  const user = await User.findOne({
    $or: [{ email }, { username }],
  }).select("-refreshToken");

  if (!user._id) {
    throw new APIERROR(404, "User does not exist");
  }

  if (!user || !(await user.isPasswordCorrect(password)))
    throw new APIERROR(401, "Invalid Credentials!!!");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) throw new APIERROR(404, "User Not Found!!!");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new API(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully!!!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (req.user?.refreshToken === null)
    throw new APIERROR(401, "User Already Logged Out!!!");

  try {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { refreshToken: null },
      },
      { new: true }
    );
    //req.user.refreshToken = null;
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    const name = req.user?.username;
    console.log(req.user?.refreshToken);
    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json(new API(200, {}, `User Logged Out Successfully!!!${name}`));
  } catch (error) {
    throw new APIERROR(500, "Something went wrong while logging out!!!");
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log(req.body?.refreshToken);
  const incomeingRefreshToken = await (req.cookies?.refreshToken ||
    req.body?.refreshToken);
  console.log(incomeingRefreshToken);
  if (!incomeingRefreshToken) throw new APIERROR(401, "UnAuthorized!!!");
  try {
    const decoded = jwt.verify(
      incomeingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded?._id);

    if (!user) throw new APIERROR(401, "Invalid Refresh Token!!!");

    if (incomeingRefreshToken !== user?.refreshToken)
      throw new APIERROR(401, "Invalid Refresh Token!!!");

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new API(
          200,
          { accessToken, newRefreshToken },
          "Access Token Refreshed Successfully!!!"
        )
      );
  } catch (error) {
    throw new APIERROR(401, "Invalid Refresh Token!!!");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = await req.body;

  console.log(req.user);
  if (!oldPassword || !newPassword)
    throw new APIERROR(400, "Old Password and New Password Required!!!");

  const user = await User.findById(req.user?._id).select("-refreshToken");

  if (!user || !(await user.isPasswordCorrect(oldPassword)))
    throw new APIERROR(401, "Invalid Old Password!!!");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new API(200, {}, "Password Changed Successfully!!!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new API(200, req.user, "User Found Successfully!!!"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName || !email)
      throw new APIERROR(400, "Full Name and Email Required!!!");
    const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        fullName,
        email: email,
      },
    }).select("-password -refreshToken");
    if (!user) throw new APIERROR(404, "User Not Found!!!");
    user.fullName = fullName;
    user.email = email;
    user.save({ validateBeforeSave: false });
    console.log(user.fullName);
    return res
      .status(200)
      .json(new API(200, user, "User Details Updated Successfully!!!"));
  } catch (error) {
    throw new APIERROR(500, "Something went wrong while updating details!!!");
  }
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new APIERROR(404, "Avatar Not Found!!!");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      avatar: avatar.url,
    },
  }).select("-password -refreshToken");
  if (!user) throw new APIERROR(404, "User Not Found!!!");
  return res
    .status(200)
    .json(new API(200, user, "User Avatar Updated Successfully!!!"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  try {
    const coverLocalPath = req.file?.path;
    if (!coverLocalPath) throw new APIERROR(404, "Cover Image Not Found!!!");
    const coverImage = await uploadOnCloudinary(coverLocalPath);
    const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        coverImage: coverImage.url,
      },
    }).select("-password -refreshToken");
    if (!user) throw new APIERROR(404, "User Not Found!!!");
    user.coverImage = coverImage.url;
    return res
      .status(200)
      .json(new API(200, user, "User Cover Image Updated Successfully!!!"));
  } catch (error) {
    throw new APIERROR(
      500,
      "Something went wrong while updating cover image!!!"
    );
  }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  console.log(username);
  if (!username?.trim()) {
    throw new APIERROR(400, "Username is Required!!!");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username.trim().toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $in: [req.user?._id, "$subscribers.subscriber"],
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
        email: 1,
      },
    },
  ]);

  if (!channel || channel.length === 0) {
    throw new APIERROR(404, "Channel Not Found!!!");
  }

  return res
    .status(200)
    .json(new API(200, channel[0], "Channel Found Successfully!!!"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new API(200, user[0].watchHistory, "Watch history fetched successfully")
    );
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};

/*
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $arrayElemAt: ["$owner", 0],
              },
            },
          },
        ],
      },
    },
  ]);
  if (!user) throw new APIERROR(404, "User Not Found!!!");
  return res
    .status(200)
    .json(
      new API(200, user[0]?.watchHistory, "Watch History Found Successfully!!!")
    );
});

*/
