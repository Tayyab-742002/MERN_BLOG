import mongoose, { isValidObjectId, mongo } from "mongoose";
import { PostCategory } from "../models/postCategory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import { Blog } from "../models/blog.model.js";
import { Category } from "../models/category.model.js";
const addBlogToCategory = asyncHandler(async (req, res) => {
  let { blogId, categoryId } = req.body;
  

  if (!isValidObjectId(blogId) && !isValidObjectId(categoryId))
    throw new ApiError(404, "Blog or Category not found");
  const blog = await Blog.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog not found");
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, "Category not found");
  const existedCategory = await PostCategory.findOne({
    $and: [
      { post: new mongoose.Types.ObjectId(blogId) },
      {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    ],
  });
  if (existedCategory) throw new ApiError(401, "Blog already added");
  const postCategory = await PostCategory.create({
    post: blogId,
    category: categoryId,
  });
  if (!postCategory) {
    throw new ApiError(501, "Error while adding blog to category");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, postCategory, "Blog added to category successfully")
    );
});
const getBlogsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId))
    throw new ApiError(404, "Category not found");
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, "Category not found");
  const pipeline = [
    {
      $match: {
        category: new mongoose.Types.ObjectId(categoryId),
      },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "post",
        foreignField: "_id",
        as: "categoryBlogs",
      },
    },
    {
      $unwind: "$categoryBlogs",
    },
    {
      $group: {
        _id: null,
        categoryBlogs: { $push: "$categoryBlogs" },
      },
    },
    {
      $project: {
        _id: 0,
        categoryBlogs: 1,
      },
    },
  ];
  const blogs = await PostCategory.aggregate(pipeline);
  if (!blogs) throw new ApiError(501, "Error while fetching blogs");
  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

export { addBlogToCategory, getBlogsByCategory };
