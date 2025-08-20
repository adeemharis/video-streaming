import express from "express";
import multer from "multer";
import Video from "../models/Video.js";
import { requireAuth } from "../middleware/auth.js";
import cloudinary from "../utils/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "videos",
    resource_type: "video",
  },
});

const upload = multer({ storage });

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
