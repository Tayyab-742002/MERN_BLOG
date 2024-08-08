import mongoose, { Schema } from "mongoose";

const postTagSchema = Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Blog",
  },
  tag: {
    type: mongoose.Types.ObjectId,
    ref: "Tag",
  },
});

export const PostTag = mongoose.model("PostTag", postTagSchema);
