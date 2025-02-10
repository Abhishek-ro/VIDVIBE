import jwt from "jsonwebtoken";
import { APIERROR } from "../utils/APIError.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) throw new APIERROR(401, "UnAuthorized!!!");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);
    const user = await User.findById(decodedToken?._id)
    if (!user) throw new APIERROR(401, "UnAuthorized user!!!");
    req.user = user;
    console.log("all good");
    next();
  } catch (error) {
    throw new APIERROR(401, "UnAuthorized!!!", error);
  }
});
