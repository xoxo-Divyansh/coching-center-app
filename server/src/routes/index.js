import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();

// All API routes under /api/v1
router.use("/v1/auth", authRoutes);

export default router;
