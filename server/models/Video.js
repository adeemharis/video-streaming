import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  filePath: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Video", videoSchema);
