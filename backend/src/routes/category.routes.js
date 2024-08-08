import { Router } from "express";
import verifyJwT from "../middlewares/auth.middleware.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  getBlogsBySlug
} from "../controllers/category.controller.js";

const router = Router();

router.route("/").get(getAllCategories).post(verifyJwT, addCategory);
router.route("/:slug").get(getBlogsBySlug)
router
  .route("/:categoryId")
  .patch(verifyJwT, updateCategory)
  .delete(verifyJwT, deleteCategory)
  .get(verifyJwT, getCategoryById);

export default router;
