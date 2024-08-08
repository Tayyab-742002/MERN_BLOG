import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import commentRouter from "./routes/comment.routes.js";
import categoryRouter from "./routes/category.routes.js";
import likeRouter from "./routes/like.routes.js";
import tagRouter from "./routes/tag.routes.js";
import postCategoryRouter from "./routes/postCategory.routes.js";
import postTagRouter from "./routes/postTag.routes.js";
import { ApiError } from "./utils/ApiError.js";
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    console.log("-------------------BACKEDN ERROR : ", err);
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // console.log("BACKEDN ERROR : ", err);

    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/blogs/comments", commentRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/blog/likes", likeRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/post-category", postCategoryRouter);
app.use("/api/v1/post-tags", postTagRouter);
export default app;
