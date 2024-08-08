import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import slugify from "slugify";
import mongoose, { isValidObjectId } from "mongoose";
const publishBlog = asyncHandler(async (req, res) => {
  const { title, content, excerpt = "" } = req.body;
  //checking validation
  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "All fields are required");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized Request");
  }
  let blogThumbnailLocalPath = "";
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    blogThumbnailLocalPath = req.files.thumbnail[0].path;
  }
  //upload the thumnail to cloudinary

  const thumbnail = await uploadOnCloudinary(blogThumbnailLocalPath);

  const blog = await Blog.create({
    title: title,
    content: content,
    excerpt: excerpt,
    thumbnail: thumbnail?.url || "",
    author: user?._id,
    slug: slugify(title),
    publishedAt: new Date(),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog Posted Successfully"));
});
const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  let blogDeleted = null;
  if (isValidObjectId(blogId)) {
    blogDeleted = await Blog.findByIdAndDelete(blogId);
  } else {
    throw new ApiError(404, "Blog Not Found");
  }
  if (blogDeleted == null) {
    throw new ApiError(
      500,
      "Error while deleting the blog or invalid blog id "
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Blog Deleted Sucessfully"));
});
const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { title, content, excerpt } = req.body;

  if (!isValidObjectId(blogId)) {
    throw new ApiError(401, "Blog not exists");
  }

  //validation
  if ([title, content].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "Fields are required");
  }

  const blogUpdated = await Blog.findByIdAndUpdate(
    blogId,
    {
      $set: {
        title: title,
        content: content,
        excerpt: excerpt,
        slug: slugify(title),
      },
    },
    {
      new: true,
    }
  );
  if (!blogUpdated) {
    throw new ApiError(501, "Error while updating blog");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, blogUpdated, "Blog updated successfully"));
});
// const getAllBlogs = asyncHandler(async (req, res) => {
//   // [
//   //   {
//   //     $lookup: {
//   //       from: "posttags",
//   //       localField: "_id",
//   //       foreignField: "post",
//   //       as: "postTags"
//   //     }
//   //   },
//   //   {
//   //     $unwind: "$postTags"
//   //   },
//   //   {
//   //     $lookup: {
//   //       from: "tags",
//   //       localField: "postTags.tag",
//   //       foreignField: "_id",
//   //       as: "tagDetails"
//   //     }
//   //   },
//   //   {
//   //     $unwind: "$tagDetails"
//   //   },
//   //   {
//   //     $group: {
//   //       _id: "$_id",
//   //       title: { $first: "$title" },
//   //       content: { $first: "$content" },
//   //       excerpt: { $first: "$excerpt" },
//   //       createdAt: { $first: "$createdAt" },
//   //       updatedAt: { $first: "$updatedAt" },
//   //       tags: { $push: "$tagDetails.name" }
//   //     }
//   //   },
//   //   {
//   //     $lookup: {
//   //       from: "comments",
//   //       localField: "_id",
//   //       foreignField: "post",
//   //       as: "comments"
//   //     }
//   //   },
//   //   {
//   //     $lookup: {
//   //       from: "likes",
//   //       localField: "_id",
//   //       foreignField: "post",
//   //       as: "likes"
//   //     }
//   //   },
//   //   {
//   //     $addFields: {
//   //       totalComments: { $size: "$comments" },
//   //       totalLikes: { $size: "$likes" }
//   //     }
//   //   },
//   //   {
//   //     $project: {
//   //       _id: 1,
//   //       title: 1,
//   //       content: 1,
//   //       excerpt: 1,
//   //       createdAt: 1,
//   //       updatedAt: 1,
//   //       tags: 1,
//   //       totalComments: 1,
//   //       totalLikes: 1
//   //     }
//   //   }
//   // ]

//   const {
//     page = 1,
//     limit = 10,
//     query = "",
//     sortBy = "createdAt",
//     sortType = "asc",
//     userId,
//   } = req.query;

//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);
//   let pipeline = [];
//   let matchStage = {};
//   if (query) {
//     matchStage.$or = [
//       {
//         title: { $regex: query, $options: "i" },
//       },
//       {
//         content: { $regex: query, $options: "i" },
//       },
//     ];
//   }
//   if (userId) {
//     // filters.author = new mongoose.Types.ObjectId(userId);
//     pipeline.unshift({ $match: new mongoose.Types.ObjectId(userId) });
//   }
//   if (Object.keys(matchStage).length > 0) {
//     matchStage.author = new mongoose.Types.ObjectId(userId);
//   }
//   //sort stage
//   const sortStage = { [sortBy]: sortType === "asc" ? 1 : -1 };
//   pipeline.push({ $sort: sortStage });
//   // pipeline.push(
//   //   {
//   //     $lookup: {
//   //       from: "posttags",
//   //       localField: "_id",
//   //       foreignField: "post",
//   //       as: "postTags",
//   //     },
//   //   },
//   //   {
//   //     $unwind: { path: "$postTags", preserveNullAndEmptyArrays: true },
//   //   },
//   //   {
//   //     $lookup: {
//   //       from: "tags",
//   //       localField: "postTags.tag",
//   //       foreignField: "_id",
//   //       as: "tagDetails",
//   //     },
//   //   },
//   //   {
//   //     $unwind: { path: "$tagDetails", preserveNullAndEmptyArrays: true },
//   //   },
//   //   {
//   //     $group: {
//   //       _id: "$_id",
//   //       title: { $first: "$title" },
//   //       content: { $first: "$content" },
//   //       excerpt: { $first: "$excerpt" },
//   //       createdAt: { $first: "$createdAt" },
//   //       updatedAt: { $first: "$updatedAt" },
//   //       thumbnail: { $first: "$thumbnail" },
//   //       tags: { $push: "$tagDetails.name" },
//   //     },
//   //   },
//   //   {
//   //     $lookup: {
//   //       from: "comments",
//   //       localField: "_id",
//   //       foreignField: "post",
//   //       as: "comments",
//   //     },
//   //   },
//   //   {
//   //     $lookup: {
//   //       from: "likes",
//   //       localField: "_id",
//   //       foreignField: "post",
//   //       as: "likes",
//   //     },
//   //   },
//   //   {
//   //     $addFields: {
//   //       totalComments: { $size: "$comments" },
//   //       totalLikes: { $size: "$likes" },
//   //     },
//   //   },
//   //   {
//   //     $project: {
//   //       _id: 1,
//   //       title: 1,
//   //       content: 1,
//   //       excerpt: 1,
//   //       createdAt: 1,
//   //       updatedAt: 1,
//   //       thumbnail: 1,
//   //       tags: 1,
//   //       totalComments: 1,
//   //       totalLikes: 1,
//   //     },
//   //   }
//   // );
//   pipeline.push(
//     {
//       $lookup: {
//         from: "posttags",
//         localField: "_id",
//         foreignField: "post",
//         as: "postTags",
//       },
//     },
//     {
//       $unwind: {
//         path: "$postTags",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $lookup: {
//         from: "tags",
//         localField: "postTags.tag",
//         foreignField: "_id",
//         as: "tagDetails",
//       },
//     },
//     {
//       $unwind: {
//         path: "$tagDetails",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "author",
//         foreignField: "_id",
//         as: "authorDetails",
//       },
//     },
//     {
//       $unwind: {
//         path: "$authorDetails",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $group: {
//         _id: "$_id",
//         title: { $first: "$title" },
//         content: { $first: "$content" },
//         excerpt: { $first: "$excerpt" },
//         createdAt: { $first: "$createdAt" },
//         updatedAt: { $first: "$updatedAt" },
//         thumbnail: { $first: "$thumbnail" },
//         tags: { $push: "$tagDetails.name" },
//         author: { $first: "$authorDetails" },
//       },
//     },
//     {
//       $lookup: {
//         from: "comments",
//         localField: "_id",
//         foreignField: "post",
//         as: "comments",
//       },
//     },
//     {
//       $lookup: {
//         from: "likes",
//         localField: "_id",
//         foreignField: "post",
//         as: "likes",
//       },
//     },
//     {
//       $addFields: {
//         totalComments: { $size: "$comments" },
//         totalLikes: { $size: "$likes" },
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         title: 1,
//         content: 1,
//         excerpt: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         thumbnail: 1,
//         tags: 1,
//         totalComments: 1,
//         totalLikes: 1,
//         author: {
//           username: "$author.username",
//           fullname: "$author.fullname",
//           avatar: "$author.profileImage",
//         },
//       },
//     }
//   );
//   const options = {
//     page: pageNumber,
//     limit: limitNumber,
//   };
//   const aggregatedBlogs = await Blog.aggregatePaginate(
//     Blog.aggregate(pipeline),
//     options
//   )
//     .then((response) => {
//       return res
//         .status(200)
//         .json(new ApiResponse(200, response, "Blogs fetched successfully"));
//     })
//     .catch((err) => {
//       throw new ApiError(501, "Error while fetching blogs");
//     });
// });
const getAllBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "asc",
    userId,
  } = req.query;
  console.log(page, limit, query, sortBy, sortType);

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  let pipeline = [];
  let matchStage = {};

  if (query) {
    matchStage.$or = [
      {
        title: { $regex: query, $options: "i" },
      },
      {
        content: { $regex: query, $options: "i" },
      },
    ];
  }

  if (userId) {
    matchStage.author = new mongoose.Types.ObjectId(userId);
  }

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  const sortStage = { [sortBy]: sortType === "asc" ? 1 : -1 };
  pipeline.push({ $sort: sortStage });

  pipeline.push(
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
    }
  );

  try {
    // Apply pagination
    const options = {
      page: pageNumber,
      limit: limitNumber,
    };
    const aggregatedBlogs = await Blog.aggregatePaginate(
      Blog.aggregate(pipeline),
      options
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, aggregatedBlogs, "Blogs fetched successfully")
      );
  } catch (err) {
    console.error(err);
    throw new ApiError(501, "Error while fetching blogs");
  }
});

const getBlogById = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!isValidObjectId(blogId)) {
    throw new ApiError(404, "Blog not found");
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched successfully"));
});
const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(401, "Slug is not valid");
  }
  const blog = await Blog.findOne({
    slug: slug,
  }).populate("author", "fullname username profileImage");

  if (!blog) {
    throw new ApiError(404, "Blog not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog fetched Successfully"));
});
export {
  publishBlog,
  deleteBlog,
  updateBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
};
