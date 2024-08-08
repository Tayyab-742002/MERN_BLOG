import { Router } from "express";
import verifyJwT from "../middlewares/auth.middleware.js";
import {
  deleteComment,
  getAllComments,
  postComment,
  updateComment,
} from "../controllers/comment.controller.js";
const router = Router();

// router.use(verifyJwT);

// router.route("/:blogId").get(getAllComments).post(postComment);
router
  .route("/:commentId")
  .delete(verifyJwT, deleteComment)
  .patch(verifyJwT, updateComment);
router.route("/:blogId").get(getAllComments);
router.route("/:blogId").post(verifyJwT, postComment);
export default router;
