import express from "express";
import {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";
import { protect, employerOnly, seekerOnly } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Job Seeker routes
router.post("/:jobId", protect, uploadSingle("resume"), applyJob);
router.get("/my-applications", protect, seekerOnly, getMyApplications);
router.delete("/:id", protect, seekerOnly, deleteApplication);

// Employer routes
router.get("/job/:jobId", protect, employerOnly, getJobApplicants);
router.put("/:id/status", protect, employerOnly, updateApplicationStatus);

export default router;