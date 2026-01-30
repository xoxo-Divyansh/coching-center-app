class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes knoen errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
