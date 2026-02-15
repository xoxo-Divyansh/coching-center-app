import express from "express";
import {
  getTeacherRequests,
  requestTeacherRole,
  reviewTeacherRequest,
} from "../controllers/teacherRequest.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

// Student submits request for teacher role
router.post("/", authMiddleware, authorize("student"), requestTeacherRole);

// Admin reviews requests
router.get("/", authMiddleware, authorize("admin"), getTeacherRequests);
router.patch(
  "/:id/review",
  authMiddleware,
  authorize("admin"),
  reviewTeacherRequest,
);

export default router;
