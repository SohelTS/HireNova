import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add company name"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],
      default: "1-10",
    },
    founded: {
      type: Number,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;