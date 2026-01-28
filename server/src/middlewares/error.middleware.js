// import ApiError from "../utils/apiError";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Unknown errors (not operational)
  if (!err.isOperational) {
    console.error(err);
    message = "Something went wrong!";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export default errorMiddleware;
