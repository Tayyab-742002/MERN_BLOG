import mongoose, { Schema } from "mongoose";

const categorySchema = Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, "slug is required"],
    unique: true,
    lowercase: true,
  },
});

export const Category = mongoose.model("Category", categorySchema);
