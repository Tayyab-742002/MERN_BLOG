import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllComments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "asc",
  } = req.query;
  const { blogId } = req.params;
  if (!blogId) {
    throw new ApiError(401, "Blog not Found");
  }
  const pipeline = [
    {
      $match: {
        post:new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        content: 1,
        user: {
          username: "$user.username",
          fullname: "$user.fullname",
          avatar: "$user.profileImage",
        },
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
  ];
  const aggregatedComments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    }
  )
    .then((response) => {
      return res
        .status(200)
        .json(new ApiResponse(200, response, "Comments fetched Successfully"));
    })
    .catch((error) => {
      throw new ApiError(500, "Error while fetching comments ");
    });
});
const postComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  if (!isValidObjectId(blogId)) {
    throw new ApiError(401, "Blog not found");
  }
  if (!content) {
    throw new ApiError(401, "Content is required");
  }
  const comment = await Comment.create({
    content: content,
    post: new mongoose.Types.ObjectId(blogId),
    user: req.user?._id,
  });

  if (!comment) {
    throw new ApiError(501, "Error while commenting ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment post successfully"));
});
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  if (!content) {
    throw new ApiError("Content of comment is required");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(404, "Blog Not Found");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: content,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"));
});
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(404, "Comment not found");
  }
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    throw new ApiError(500, "Error while deleting comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment Deleted Successfully"));
});

export { getAllComments, postComment, updateComment, deleteComment };
