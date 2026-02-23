import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";


const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));

    throw new ApiError(extractedErrors[0].message, 400);
  };
};

export default validateRequest;

