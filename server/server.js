import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videoRoutes.js";
import videoPlayRoutes from "./routes/videoPlayRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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


// Build a clean allow-list from env (comma-separated)
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// CORS: allow from allow-list, allow Postman/cURL (no Origin), block others
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // non-browser clients
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(null, false); // respond with no CORS headers
    },
    credentials: true,
  })
);

// (Optional) quick preflight helper without path-to-regexp shenanigans
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});


app.use(express.json());
app.use(cookieParser());

// app.use("/uploads", express.static("uploads"));

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/playvideos", videoPlayRoutes);
app.use("/api/users", userRoutes);

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