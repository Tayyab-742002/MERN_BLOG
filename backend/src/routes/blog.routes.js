import { Router } from "express";
import {
  publishBlog,
  deleteBlog,
  updateBlog,
  getBlogById,
  getAllBlogs,
  getBlogBySlug,
} from "../controllers/blog.controller.js";
import verifyJwT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
upload;
const router = Router();

// router.use(verifyJwT);
// router.route("/publish-blog").post(
//   verifyJwT,
//   upload.fields([
//     {
//       name: "thumbnail",
//       maxCount: 1,
//     },
//   ]),
//   publishBlog
// );
router.route("/").get(getAllBlogs);
router.route("/").post(
  verifyJwT,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishBlog
);
router.route("/:blogId").get(getBlogById).delete(deleteBlog).patch(updateBlog);
router.route("/blog/:slug").get(getBlogBySlug);
export default router;
