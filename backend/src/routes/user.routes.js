import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAccountDetails,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwT from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/register-user")
  .post(upload.single("profileImage"), registerUser);

router.route("/login-user").post(loginUser);
router.route("/logout-user").post(verifyJwT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-details").patch(verifyJwT, updateAccountDetails);
router.route("/current-user").get(verifyJwT, getCurrentUser);
export default router;
