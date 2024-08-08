import asyncHandler from "express-async-handler";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
const toggleLike = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId)) {
    throw new ApiError(404, "Blog not Found");
  }

  const existedLike = await Like.findOne({
    $and: [
      {
        post: new mongoose.Types.ObjectId(blogId),
      },
      {
        user: new mongoose.Types.ObjectId(req.user?._id),
      },
    ],
  });
  let likeRes;
  console.log(existedLike);
  if (existedLike) {
    //unlike the post
    likeRes = await Like.findByIdAndDelete(existedLike?._id);
  } else {
    likeRes = await Like.create({
      post: blogId,
      user: req.user?._id,
    });
  }
  if (!likeRes) {
    throw new ApiError(501, "Error while toggling like ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, likeRes, "Like toggle Successfully"));
});

const getLikesByBlogId = asyncHandler(async (req, res) => {
  const { blogId } = req.query;
  if (!isValidObjectId(blogId)) {
    throw new ApiError(404, "Blog Not Found");
  }
  const likes = await Like.find({ post: blogId });
  if (!likes) {
    throw new ApiError(404, "Blog Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, likes.length, "Likes Fetched Successfully"));
});
export { toggleLike, getLikesByBlogId };
