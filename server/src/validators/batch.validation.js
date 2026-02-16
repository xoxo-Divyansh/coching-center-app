import { body, param } from "express-validator";

export const createBatchSchema = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Batch name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Batch name must be between 3 and 100 characters"),

  body("course")
    .notEmpty()
    .withMessage("Course id is required")
    .isMongoId()
    .withMessage("Invalid course id"),

  body("schedule.days")
    .isArray({ min: 1 })
    .withMessage("At least one day is required"),

  body("schedule.days.*")
    .isIn(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    .withMessage("Invalid day value"),

  body("schedule.startTime")
    .notEmpty()
    .withMessage("Start time is required"),

  body("schedule.endTime")
    .notEmpty()
    .withMessage("End time is required"),
];

export const assignTeacherSchema = [
  param("id")
    .isMongoId()
    .withMessage("Invalid batch id"),

  body("teacherId")
    .notEmpty()
    .withMessage("Teacher id is required")
    .isMongoId()
    .withMessage("Invalid teacher id"),
];

export const addStudentsSchema = [
  param("id")
    .isMongoId()
    .withMessage("Invalid batch id"),

  body("students")
    .isArray({ min: 1 })
    .withMessage("At least one student is required"),

  body("students.*")
    .isMongoId()
    .withMessage("Invalid student id"),
];
