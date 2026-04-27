import express from "express";
import {
  createCompany,
  getCompany,
  getMyCompany,
  updateCompany,
  getAllCompanies,
} from "../controllers/companyController.js";
import { protect, employerOnly } from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCompanies);
router.get("/:id", getCompany);

// Private routes
router.post("/", protect, employerOnly, uploadSingle("logo"), createCompany);
router.get("/my-company", protect, employerOnly, getMyCompany);
router.put("/:id", protect, employerOnly, uploadSingle("logo"), updateCompany);

export default router;