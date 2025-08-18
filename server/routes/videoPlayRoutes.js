import express from "express";
import Video from "../models/Video.js";
import { requireAuth } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all videos uploaded by the logged-in user
router.get("/my", requireAuth, async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get video by ID
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("user", "username");
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Like video
router.post("/:id/like", requireAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.dislikes = video.dislikes.filter((u) => u.toString() !== req.user.id);
    if (!video.likes.includes(req.user.id)) {
      video.likes.push(req.user.id);
    }
    await video.save();

    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Dislike video
router.post("/:id/dislike", requireAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.likes = video.likes.filter((u) => u.toString() !== req.user.id);
    if (!video.dislikes.includes(req.user.id)) {
      video.dislikes.push(req.user.id);
    }
    await video.save();

    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add comment
router.post("/:id/comment", requireAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const comment = { user: req.user.id, text: req.body.text };
    video.comments.push(comment);
    await video.save();

    res.json(video.comments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search videos by title, description, or tags
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Filter videos by tag
router.get("/tag/:tag", async (req, res) => {
  try {
    const { tag } = req.params;
    const videos = await Video.find({ tags: { $regex: tag, $options: "i" } })
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// // Delete a video
// router.delete("/:id", requireAuth, async (req, res) => {
//   try {
//     const video = await Video.findById(req.params.id);
//     if (!video) return res.status(404).json({ error: "Video not found" });

//     // Ensure only uploader can delete
//     if (video.user.toString() !== req.user.id) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     await video.deleteOne();
//     res.json({ message: "Video deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });
// Delete a video (also from Cloudinary)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Ensure only uploader can delete
    if (video.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete from Cloudinary if it exists
    if (video.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: "video" });
      } catch (cloudErr) {
        console.error("Cloudinary deletion error:", cloudErr);
        // we don’t return here because we still want to remove it from DB
      }
    }

    await video.deleteOne();
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
