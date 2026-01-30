import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";

const authMiddleware = async (req, res, next) => {
   console.log("SIGN SECRET 👉", process.env.JWT_SECRET);//

  try {
    // 1️⃣ Get token from header (optional chaining)
    const authHeader = req.headers?.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError("Not authorized, token missing", 401));
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError("User not found", 401));
    }

    // 5️⃣ Attach user
    req.user = user;
    next();
  } catch (error) {
    // JWT specific errors
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError("Invalid token", 401));
    }

    if (error.name === "TokenExpiredError") {
      return next(new ApiError("Token expired", 401));
    }

    next(error); // let global error handler handle rest
  }
};

export default authMiddleware;
