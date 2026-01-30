import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 Protected route
router.get("/me", authMiddleware, getMe);

export default router;
