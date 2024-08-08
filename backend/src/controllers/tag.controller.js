import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import slugify from "slugify";
import { Tag } from "../models/tag.model.js";
import { Blog } from "../models/blog.model.js";
const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(401, "Tag name is required");
  }
  const tag = await Tag.create({
    name: name,
    slug: slugify(name),
  });
  if (!tag) {
    throw new ApiError(501, "Error while creating tag");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tag, "Tag created successfully"));
});
const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find();
  if (!tags) {
    throw new ApiError(501, "Error while fetching Tags");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tags, "Tags fetched successfully"));
});
const getTagById = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  if (!isValidObjectId(tagId)) {
    throw new ApiError(404, "Tag no found");
  }
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new ApiError(501, "Error while fetching tag ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tag, "Tag fetched successfully"));
});
const deleteTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  if (!isValidObjectId(tagId)) throw new ApiError(404, "Tag not found");

  const tag = await Tag.findByIdAndDelete(tagId);
  if (!tag) throw new ApiError(501, "Error while deleting tag");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tag deleted Successfully"));
});
const updateTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { tagId } = req.params;
  if (!isValidObjectId(tagId)) throw new ApiError(404, "Tag not found");
  if (!name) throw new ApiError(401, "Tag is required");
  const tag = await Tag.findByIdAndUpdate(
    tagId,
    {
      name: name,
      slug: slugify(name),
    },
    { new: true }
  );
  if (!tag) throw new ApiError(501, "Error while updating tag");
  return res
    .status(200)
    .json(new ApiResponse(200, tag, "Tag updated Successfully"));
});
const getBlogsBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Find the tag by slug
  const tag = await Tag.findOne({ slug: slug });
  if (!tag) {
    throw new ApiError(404, "Tag Not Found");
  }

  // Proceed to fetch blogs using the tag ID
  const blogs = await Blog.aggregate([
    {
      $lookup: {
        from: "posttags",
        localField: "_id",
        foreignField: "post",
        as: "postTags",
      },
    },
    {
      $unwind: {
        path: "$postTags",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "postTags.tag": tag._id,
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "postTags.tag",
        foreignField: "_id",
        as: "tagDetails",
      },
    },
    {
      $unwind: {
        path: "$tagDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $unwind: {
        path: "$authorDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        content: { $first: "$content" },
        slug: { $first: "$slug" },
        excerpt: { $first: "$excerpt" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        thumbnail: { $first: "$thumbnail" },
        tags: { $push: "$tagDetails.name" },
        author: { $first: "$authorDetails" },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalComments: { $size: "$comments" },
        totalLikes: { $size: "$likes" },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        content: 1,
        excerpt: 1,
        createdAt: 1,
        updatedAt: 1,
        slug: 1,
        thumbnail: 1,
        tags: 1,
        totalComments: 1,
        totalLikes: 1,
        author: {
          username: "$author.username",
          fullname: "$author.fullname",
          avatar: "$author.profileImage",
        },
      },
    },
  ]);

  if (!blogs) throw new ApiError(501, "ERROR FETCHING BLOGS");

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "BLOGS FETCHED SUCCESSFULLY"));
});
export {
  createTag,
  getAllTags,
  getTagById,
  deleteTag,
  updateTag,
  getBlogsBySlug,
};
