import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videoRoutes.js";
import videoPlayRoutes from "./routes/videoPlayRoutes.js";

import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/playvideos", videoPlayRoutes);

// start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

  // Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}