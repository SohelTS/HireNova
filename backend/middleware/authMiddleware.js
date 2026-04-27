import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Protect routes — only logged in users
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// Employer only routes
const employerOnly = (req, res, next) => {
  if (req.user && req.user.role === "employer") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied - Employers only");
  }
};

// Job Seeker only routes
const seekerOnly = (req, res, next) => {
  if (req.user && req.user.role === "jobseeker") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied - Job Seekers only");
  }
};

export { protect, employerOnly, seekerOnly };