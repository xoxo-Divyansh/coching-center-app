import express from "express";
import authRoutes from "./auth.router.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// All API routes under /api/v1
router.use("/auth", authRoutes);

export default router;
