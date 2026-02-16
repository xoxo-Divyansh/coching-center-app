import express from "express";
import {
  createBatch,
  assignTeacher,
  addStudents,
  getAllBatches,
  getTeacherBatches,
  getStudentBatches,
  getBatchById,
} from "../controllers/batch.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createBatchSchema,
  assignTeacherSchema,
  addStudentsSchema,
} from "../validators/batch.validation.js";

const router = express.Router();

// ================== Admin Routes ==================

router.post(
  "/",
  auth,
  authorize("admin"),
  validateRequest(createBatchSchema),
  createBatch
);

router.get("/", auth, authorize("admin"), getAllBatches);

router.patch(
  "/:id/assign-teacher",
  auth,
  authorize("admin"),
  validateRequest(assignTeacherSchema),
  assignTeacher
);

router.patch(
  "/:id/add-students",
  auth,
  authorize("admin"),
  validateRequest(addStudentsSchema),
  addStudents
);

// ================== Teacher Routes ==================

router.get("/teacher/my", auth, authorize("teacher"), getTeacherBatches);

// ================== Student Routes ==================

router.get("/student/my", auth, authorize("student"), getStudentBatches);

// ================== Common Routes ==================

router.get("/:id", auth, getBatchById);

export default router;
