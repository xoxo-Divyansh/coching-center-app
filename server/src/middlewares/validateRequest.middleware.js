import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const firstError = result.array({ onlyFirstError: true })[0];
  throw new ApiError(firstError.msg, 400);
};

export default validateRequest;
