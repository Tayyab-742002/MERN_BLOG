import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
const verifyJwT = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
    // console.log(`"TOOOOKKKEENN ::: ${token}`);
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token ");
    }
    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error || "Unauthorized Request"));
  }
};

export default verifyJwT;
