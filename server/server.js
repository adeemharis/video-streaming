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

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;
// const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
// If you deploy frontend separately (Vercel/Netlify), set this to that URL
// You can also pass multiple origins as a comma-separated list
// const allowOrigins = (process.env.CORS_ORIGIN || "https://video-streaming-two-nu.vercel.app", "http://localhost:5173")
//   .split(",")
//   .map(s => s.trim());

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:3000", // if you sometimes run React default
  "https://video-streaming-two-nu.vercel.app" // production frontend
];

// app.use(cors({ origin: allowOrigins, credentials: true }));
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.options("*", cors());
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
    app.listen(PORT, "0.0.0.0",() => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

  // Serve React frontend in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/dist", "index.html"));
//   });
// }