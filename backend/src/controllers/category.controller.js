import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Category } from "../models/category.model.js";
import slugify from "slugify";
import { Blog } from "../models/blog.model.js";
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories) {
    throw new ApiError(500, "Error fetching categories");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});
const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(401, "Name  is required");
  }
  const category = await Category.create({
    name: name,
    slug: slugify(name),
  });
  if (!category) {
    throw new ApiError(501, "Error while creating category");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category created successfully"));
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId)) {
    throw new ApiError(404, "Category not found");
  }
  const categoryDeleted = await Category.findByIdAndDelete(categoryId);
  if (!categoryDeleted) {
    throw new ApiError(501, "Error while deleting category");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category Deleted Successfully"));
});
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId))
    throw new ApiError(404, "Cateogory Not Found");
  if (!name) {
    throw new ApiResponse(401, "Name  is required");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      name: name,
      slug: slugify(name),
    },
    {
      new: true,
    }
  );
  if (!updatedCategory) {
    throw new ApiError(501, "Error while updating category");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Category updated successfully")
    );
});
const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!isValidObjectId(categoryId)) {
    throw new ApiError(404, "Category not found");
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(501, "Error while fetching category ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
});
const getBlogsBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Find the tag by slug
  const category = await Category.findOne({ slug: slug });
  if (!category) {
    throw new ApiError(404, "Category Not Found");
  }

  // Proceed to fetch blogs using the tag ID
  const categories = await Blog.aggregate([
    {
      $lookup: {
        from: "postcategories",
        localField: "_id",
        foreignField: "post",
        as: "postcaTegories",
      },
    },
    {
      $unwind: {
        path: "$postcaTegories",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        "postcaTegories.category": category._id,
      },
    },
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

  if (!categories) throw new ApiError(501, "ERROR FETCHING BLOGS");

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "BLOGS FETCHED SUCCESSFULLY"));
});
export {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  getBlogsBySlug,
};
