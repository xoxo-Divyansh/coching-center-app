import express from "express";
import {
  getTeacherRequests,
  getMyTeacherRequest,
  requestTeacherRole,
  reviewTeacherRequest,
} from "../controllers/teacherRequest.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validateRequest from "../middlewares/validateRequest.middleware.js";
import {
  validateCreateTeacherRequest,
  validateTeacherRequestListQuery,
  validateTeacherRequestReview,
} from "../validators/teacherRequest.validation.js";

const router = express.Router();

// Student submits request for teacher role
router.post(
  "/",
  authMiddleware,
  authorize("student"),
  validateCreateTeacherRequest,
  validateRequest(),
  requestTeacherRole,
);
router.get("/me", authMiddleware, getMyTeacherRequest);

// Admin reviews requests
router.get(
  "/",
  authMiddleware,
  authorize("admin"),
  validateTeacherRequestListQuery,
  validateRequest(),
  getTeacherRequests,
);
router.patch(
  "/:id/review",
  authMiddleware,
  authorize("admin"),
  validateTeacherRequestReview,
  validateRequest(),
  reviewTeacherRequest,
);

export default router;
