import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

// Multer with memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Helper to upload buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer, folder = "profile_images") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};