import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        company: user.company,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: "Logged out successfully" });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("company")
    .populate("savedJobs");

  res.json({ success: true, user });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        location: updatedUser.location,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Upload resume
// @route   PUT /api/auth/resume
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a file");
  }

  user.resume = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({
    success: true,
    message: "Resume uploaded successfully",
    resume: user.resume,
  });
});

// @desc    Save or unsave a job
// @route   PUT /api/auth/saved-jobs/:jobId
// @access  Private
const toggleSavedJob = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const jobId = req.params.jobId;

  const isSaved = user.savedJobs.includes(jobId);

  if (isSaved) {
    // Remove from saved
    user.savedJobs = user.savedJobs.filter(
      (id) => id.toString() !== jobId
    );
    await user.save();
    res.json({ success: true, message: "Job removed from saved" });
  } else {
    // Add to saved
    user.savedJobs.push(jobId);
    await user.save();
    res.json({ success: true, message: "Job saved successfully" });
  }
});

// @desc    Get saved jobs
// @route   GET /api/auth/saved-jobs
// @access  Private
const getSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedJobs",
    populate: {
      path: "company",
      select: "name logo location",
    },
  });

  res.json({ success: true, savedJobs: user.savedJobs });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  uploadResume,
  toggleSavedJob,
  getSavedJobs,
};