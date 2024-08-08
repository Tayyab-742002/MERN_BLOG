import mongoose, { Schema } from "mongoose";

const postCategorySchema = Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Blog",
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
});

export const PostCategory = mongoose.model("PostCategory", postCategorySchema);
