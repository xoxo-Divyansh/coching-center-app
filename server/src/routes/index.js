import express from "express";
import adminRoutes from "./admin.router.js";
import authRoutes from "./auth.router.js";
import batchRouter from "./batch.router.js"
import courseRoutes from "./course.router.js";
import enrollmentRoutes from "./enrollment.router.js";
import teacherRequestRoutes from "./teacherRequest.router.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/batches", batchRouter)
router.use("/teacher-requests", teacherRequestRoutes);
router.use("/admin", adminRoutes);

export default router;

