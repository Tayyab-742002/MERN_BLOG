import mongoose, { Schema } from "mongoose";

const tagSchema = Schema({
  name: {
    type: String,
    required: [true, "Tag name is required"],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
    lowercase: true,
  },
});

export const Tag = mongoose.model("Tag", tagSchema);
