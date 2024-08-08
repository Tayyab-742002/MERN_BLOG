import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PostTag } from "../models/postTag.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Blog } from "../models/blog.model.js";
import { Tag } from "../models/tag.model.js";

const addPostTag = asyncHandler(async (req, res) => {
  const { blogId, tagId } = req.body;
  if (!isValidObjectId(blogId) && !isValidObjectId(blogId)) {
    throw new ApiError(404, "Blog or tagId is not valid");
  }
  const blog = await Blog.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog not found");
  const tag = await Tag.findById(tagId);
  if (!tag) throw new ApiError(404, "Tag not found");
  const existedTag = await PostTag.findOne({
    $and: [
      {
        post: new mongoose.Types.ObjectId(blogId),
      },
      {
        tag: new mongoose.Types.ObjectId(tagId),
      },
    ],
  });
  if (existedTag) throw new ApiError(401, "Tag is already added to blog");
  const postTag = await PostTag.create({
    post: blogId,
    tag: tagId,
  });
  if (!postTag) throw new ApiError(501, "Error while adding tag");
  return res
    .status(200)
    .json(new ApiResponse(200, postTag, "Tag added successfully"));
});
const getBlogsByTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  if (!isValidObjectId) throw new ApiError(404, "Tag not found");
  const tag = await Tag.findById(tagId);
  if (!tag) throw new ApiError(404, "Tag not found");

  const pipeline = [
    {
      $match: {
        tag: new mongoose.Types.ObjectId(tagId),
      },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "post",
        foreignField: "_id",
        as: "tagBlogs",
      },
    },
    {
      $unwind: "$tagBlogs",
    },
    {
      $group: {
        _id: null,
        tagBlogs: { $push: "$tagBlogs" },
      },
    },
    {
      $project: {
        _id: 0,
        tagBlogs: 1,
      },
    },
  ];

  const blogs = await PostTag.aggregate(pipeline);
  if (!blogs) throw new ApiError(501, "Error while fetching blogs");

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs by tag fetched successfully"));
});
const getTagsByBlogId = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId)) {
    throw new ApiError(404, "Blog Not Found");
  }
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not Found");
  }
  const tags = await PostTag.find({ post: blogId }).populate("tag", "name -_id");
  if (!tags) {
    throw new ApiError(501, "ERROR FETCHING TAGS");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tags, "Tags fetched successfully"));
});
export { addPostTag, getBlogsByTag, getTagsByBlogId };
