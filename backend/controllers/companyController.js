import asyncHandler from "express-async-handler";
import Company from "../models/Company.js";
import User from "../models/User.js";

// @desc    Create company
// @route   POST /api/companies
// @access  Private (Employer only)
const createCompany = asyncHandler(async (req, res) => {
  const { name, description, website, location, industry, size, founded, socialLinks } = req.body;

  // Check if employer already has a company
  const existingCompany = await Company.findOne({ owner: req.user._id });
  if (existingCompany) {
    res.status(400);
    throw new Error("You already have a company profile");
  }

  const company = await Company.create({
    name,
    description,
    website,
    location,
    industry,
    size,
    founded,
    socialLinks,
    owner: req.user._id,
    logo: req.file ? `/uploads/${req.file.filename}` : "",
  });

  // Link company to user
  await User.findByIdAndUpdate(req.user._id, { company: company._id });

  res.status(201).json({ success: true, company });
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate(
    "owner",
    "name email avatar"
  );

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  res.json({ success: true, company });
});

// @desc    Get my company
// @route   GET /api/companies/my-company
// @access  Private (Employer only)
const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  res.json({ success: true, company });
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Employer only)
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // Check ownership
  if (company.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this company");
  }

  const updatedData = {
    ...req.body,
    logo: req.file ? `/uploads/${req.file.filename}` : company.logo,
  };

  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true }
  );

  res.json({ success: true, company: updatedCompany });
});

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().populate(
    "owner",
    "name email"
  );
  res.json({ success: true, companies });
});

export {
  createCompany,
  getCompany,
  getMyCompany,
  updateCompany,
  getAllCompanies,
};