import { body, param, query } from "express-validator";

export const validateAdminUsersQuery = [
  query("q").optional().isString().trim(),
  query("role")
    .optional()
    .isIn(["all", "student", "teacher", "admin"])
    .withMessage("Invalid role filter"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

export const validateUserIdParam = [
  param("id").isMongoId().withMessage("Invalid user id"),
];

export const validateUpdateUserRole = [
  body("role")
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid role"),
];
