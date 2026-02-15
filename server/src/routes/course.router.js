import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStudents,
} from "../controllers/course.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

// 📚 Public read routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// 👨‍🎓 Protected route (must be before "/:id" when dynamic routes are protected)
router.get("/:id/students", authMiddleware, getCourseStudents);

// 🔐 Admin only
router.post("/", authMiddleware, authorize("admin"), createCourse);
router.put("/:id", authMiddleware, authorize("admin"), updateCourse);
router.delete("/:id", authMiddleware, authorize("admin"), deleteCourse);

export default router;
