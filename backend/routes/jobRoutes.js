import express from "express";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  closeJob,
} from "../controllers/jobController.js";
import { protect, employerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJob);

// Private routes
router.post("/", protect, employerOnly, createJob);
router.get("/employer/my-jobs", protect, employerOnly, getMyJobs);
router.put("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);
router.put("/:id/close", protect, employerOnly, closeJob);

export default router;