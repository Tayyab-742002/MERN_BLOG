import { Router } from "express";
import verifyJwT from "../middlewares/auth.middleware.js";
import {
  createTag,
  deleteTag,
  getAllTags,
  getBlogsBySlug,
  getTagById,
  updateTag,
} from "../controllers/tag.controller.js";

const router = Router();

// router.use(verifyJwT);
router.route("/").post(verifyJwT, createTag).get(getAllTags);

router
  .route("/:tagId")
  .get(getTagById)
  .patch(verifyJwT, updateTag)
  .delete(verifyJwT, deleteTag);
router.route("/tag/:slug").get(getBlogsBySlug);
export default router;
