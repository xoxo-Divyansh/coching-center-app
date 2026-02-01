import express from "express";
import {
  enrollCourse,
  getEnrollments,
  updateEnrollmentStatus,
} from "../controllers/enrollment.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

/**
 * STUDENT
 * POST /api/enrollments
 */
router.post(
  "/",
  authMiddleware,
  authorize("student"),
  enrollCourse
);

/**
 * STUDENT / ADMIN
 * GET /api/enrollments
 */
router.get(
  "/",
  authMiddleware,
  getEnrollments
);

/**
 * ADMIN / COURSE CREATOR
 * PATCH /api/enrollments/:id/status
 */
router.patch(
  "/:id/status",
  authMiddleware,
  authorize("admin", "teacher"),
  updateEnrollmentStatus
);

export default router;
