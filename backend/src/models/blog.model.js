import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const blogSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "blog content is required"],
    },
    publishedAt: {
      type: Date,
      required: [true, "published date is required"],
    },
    excerpt: {
      type: String,
    },
    thumbnail: {
      type: String,
    },

    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

blogSchema.plugin(mongooseAggregatePaginate);
export const Blog = mongoose.model("Blog", blogSchema);
