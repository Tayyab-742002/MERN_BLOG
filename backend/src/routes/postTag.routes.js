import { Router } from "express";
import {
  addPostTag,
  getBlogsByTag,
  getTagsByBlogId,
} from "../controllers/postTag.controller.js";

const router = Router();
router.route("/").post(addPostTag);
router.route("/:tagId").get(getBlogsByTag);
router.route("/blog/:blogId").get(getTagsByBlogId);
export default router;
