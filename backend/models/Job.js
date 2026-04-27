import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add job title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add job description"],
    },
    requirements: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      required: [true, "Please add job location"],
    },
    jobType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "remote",
      ],
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please add job category"],
      enum: [
        "Technology",
        "Marketing",
        "Finance",
        "Healthcare",
        "Education",
        "Design",
        "Sales",
        "Engineering",
        "Human Resources",
        "Other",
      ],
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly",
      },
    },
    experience: {
      type: String,
      enum: [
        "entry",
        "junior",
        "mid",
        "senior",
        "lead",
        "manager",
      ],
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    deadline: {
      type: Date,
      default: null,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    vacancies: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
jobSchema.index({
  title: "text",
  description: "text",
  location: "text",
});

const Job = mongoose.model("Job", jobSchema);

export default Job;