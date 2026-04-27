import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  uploadResume,
  toggleSavedJob,
  getSavedJobs,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, uploadSingle("avatar"), updateProfile);
router.put("/resume", protect, uploadSingle("resume"), uploadResume);
router.put("/saved-jobs/:jobId", protect, toggleSavedJob);
router.get("/saved-jobs", protect, getSavedJobs);

export default router;