import upload from "../config/cloudinary.js";

// Single file upload
const uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files upload
const uploadMultiple = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);

export { uploadSingle, uploadMultiple };