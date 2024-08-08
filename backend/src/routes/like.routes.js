import { Router } from "express";
import verifyJwT from "../middlewares/auth.middleware.js";
import {
  getLikesByBlogId,
  toggleLike,
} from "../controllers/like.controller.js";
const router = Router();

router.route("/:blogId").post(verifyJwT, toggleLike);
router.route("/").get(getLikesByBlogId);
export default router;
