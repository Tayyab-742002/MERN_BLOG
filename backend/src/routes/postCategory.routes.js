import { Router } from "express";
import {
  addBlogToCategory,
  getBlogsByCategory,
} from "../controllers/postCategory.controller.js";

const router = Router();

router.route("/").post(addBlogToCategory);
router.route("/:categoryId").get(getBlogsByCategory);
export default router;
