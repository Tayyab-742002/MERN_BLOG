import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchama = Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
commentSchama.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchama);
