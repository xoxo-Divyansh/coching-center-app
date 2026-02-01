import express from "express";
import adminRoutes from "./admin.router.js";
import authRoutes from "./auth.router.js";
import courseRoutes from "./course.router.js";
import enrollmentRoutes from "./enrollment.router.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("admin", adminRoutes);

export default router;
