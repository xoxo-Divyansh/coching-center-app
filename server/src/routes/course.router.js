import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

// public (logged-in)
router.get("/", authMiddleware, getCourses);
router.get("/:id", authMiddleware, getCourseById);

// Admin only
router.post("/", authMiddleware, authorize("admin"), createCourse);
router.put("/:id", authMiddleware, authorize("admin"), updateCourse);
router.delete("/:id", authMiddleware, authorize("admin"), deleteCourse);

export default router;
