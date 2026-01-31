import express from "express";
import authRoutes from "./auth.router.js";
import courseRoutes from "./course.router.js";
import enrollmentRoutes from "./enrollment.route.js"
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/enrollments", enrollmentRoutes)

export default router;
