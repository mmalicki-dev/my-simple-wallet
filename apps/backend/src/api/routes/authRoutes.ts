import { Router } from "express";
import {
  register,
  login,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  refresh,
  logout,
  updateProfile,
  requestEmailChange,
  confirmEmailChange,
  getSessions,
  deleteSession,
  deleteUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, getMe);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.put("/profile", protect, updateProfile);
router.post("/change-email", protect, requestEmailChange);
router.get("/confirm-email-change", confirmEmailChange);
router.get("/sessions", protect, getSessions);
router.delete("/sessions/:id", protect, deleteSession);
router.delete("/delete-user", protect, deleteUser);

export default router;
