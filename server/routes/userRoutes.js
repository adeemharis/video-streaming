import express from "express";
import bcrypt from "bcryptjs";
import { auth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Upload/change profile image
router.post("/profile/image", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.profileImage = req.file.path; // Cloudinary returns URL in path
    await user.save();

    res.json({ profileImage: user.profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// Change password
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

export default router;
