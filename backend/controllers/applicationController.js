import asyncHandler from "express-async-handler";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc    Apply to job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker only)
const applyJob = asyncHandler(async (req, res) => {
  const { coverLetter } = req.body;
  const jobId = req.params.jobId;

  // Check job exists
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Check job is open
  if (job.status !== "open") {
    res.status(400);
    throw new Error("This job is no longer accepting applications");
  }

  // Check already applied
  const alreadyApplied = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (alreadyApplied) {
    res.status(400);
    throw new Error("You have already applied to this job");
  }

  // Resume required
  const resume = req.file
    ? `/uploads/${req.file.filename}`
    : req.user.resume;

  if (!resume) {
    res.status(400);
    throw new Error("Please upload a resume");
  }

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    resume,
    coverLetter,
  });

  // Add application to job
  job.applicants.push(application._id);
  await job.save();

  res.status(201).json({ success: true, application });
});

// @desc    Get my applications (Job Seeker)
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    applicant: req.user._id,
  })
    .populate({
      path: "job",
      populate: {
        path: "company",
        select: "name logo location",
      },
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
});

// @desc    Get applicants for a job (Employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate("applicant", "name email avatar phone location skills resume")
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
});

// @desc    Update application status (Employer)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  application.status = status || application.status;
  application.notes = notes || application.notes;

  await application.save();

  res.json({ success: true, application });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker only)
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await application.deleteOne();

  res.json({ success: true, message: "Application withdrawn successfully" });
});

export {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  deleteApplication,
};