import { body, param, query } from "express-validator";

export const validateCreateTeacherRequest = [
  body("reason")
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Reason must be between 10 and 1000 characters"),
];

export const validateTeacherRequestListQuery = [
  query("q").optional().isString().trim(),
  query("status")
    .optional()
    .isIn(["all", "pending", "approved", "rejected"])
    .withMessage("Invalid status filter"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

export const validateTeacherRequestReview = [
  param("id").isMongoId().withMessage("Invalid teacher request id"),
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be approved or rejected"),
];
