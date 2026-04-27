import asyncHandler from "express-async-handler";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = asyncHandler(async (req, res) => {
  const {
    title, description, requirements, responsibilities,
    location, jobType, category, salary, experience,
    skills, deadline, isRemote, vacancies,
  } = req.body;

  // Employer must have a company
  if (!req.user.company) {
    res.status(400);
    throw new Error("Please create a company profile first");
  }

  const job = await Job.create({
    title, description, requirements, responsibilities,
    location, jobType, category, salary, experience,
    skills, deadline, isRemote, vacancies,
    company: req.user.company,
    postedBy: req.user._id,
  });

  res.status(201).json({ success: true, job });
});

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const {
    keyword, location, category, jobType,
    experience, minSalary, maxSalary, page = 1, limit = 10,
  } = req.query;

  const query = { status: "open" };

  // Keyword search
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { skills: { $in: [new RegExp(keyword, "i")] } },
    ];
  }

  // Filters
  if (location) query.location = { $regex: location, $options: "i" };
  if (category) query.category = category;
  if (jobType) query.jobType = jobType;
  if (experience) query.experience = experience;
  if (minSalary) query["salary.min"] = { $gte: Number(minSalary) };
  if (maxSalary) query["salary.max"] = { $lte: Number(maxSalary) };

  const total = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .populate("company", "name logo location industry")
    .populate("postedBy", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("company", "name logo location description website industry size")
    .populate("postedBy", "name email");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.json({ success: true, job });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this job");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, job: updatedJob });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this job");
  }

  await job.deleteOne();
  await Application.deleteMany({ job: req.params.id });

  res.json({ success: true, message: "Job deleted successfully" });
});

// @desc    Get employer's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer only)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate("company", "name logo")
    .sort({ createdAt: -1 });

  res.json({ success: true, jobs });
});

// @desc    Close job
// @route   PUT /api/jobs/:id/close
// @access  Private (Employer only)
const closeJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  job.status = "closed";
  await job.save();

  res.json({ success: true, message: "Job closed successfully" });
});

export {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
  closeJob,
};