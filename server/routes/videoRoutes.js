import express from "express";
import multer from "multer";
import path from "path";
import Video from "../models/Video.js";
import { requireAuth } from "../middleware/auth.js";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // folder to store videos
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "videos",
    resource_type: "video",
  },
});

const upload = multer({ storage });

// Upload video
// router.post("/upload", requireAuth, upload.single("video"), async (req, res) => {
//   try {
//     const { title, description, tags } = req.body;

//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const video = new Video({
//       user: req.user.id,
//       title,
//       description,
//       tags: tags ? tags.split(",").map((t) => t.trim()) : [],
//       filePath: `/uploads/${req.file.filename}`,
//     });

//     await video.save();
//     res.json({ message: "Video uploaded successfully", video });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// Upload video
router.post("/upload", requireAuth, upload.single("video"), async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Cloudinary gives us the hosted URL in req.file.path
    const video = new Video({
      user: req.user.id,
      title,
      description,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      filePath: req.file.path,
      cloudinaryId: req.file.filename,  // Save Cloudinary public_id
    });

    await video.save();

    res.json({ message: "Video uploaded successfully", video });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
