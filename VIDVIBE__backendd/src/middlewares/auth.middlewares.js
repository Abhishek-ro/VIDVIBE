import jwt from "jsonwebtoken";
import { APIERROR } from "../utils/APIError.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new APIERROR(401, "UnAuthorized!!!");

    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new APIERROR(401, "UnAuthorized user!!!");
    req.user = user;

    next();
  } catch (error) {
    throw new APIERROR(401, "UnAuthorized!!!", error);
  }
});
