import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper to create JWT token
const generateToken = (userId) => {
  console.log("SIGN SECRET 👉", process.env.JWT_SECRET);//

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register user
export const registerUser = asyncHandler(async (req, res) => {
  console.log("BODY 👉", req.body);

  if (!req.body) {
    throw new ApiError("Request body is missing", 400);
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError("All fields are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: generateToken(user._id),
  });
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError("Invalid credentials", 401);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
  });
});

// ✅ Get logged-in user
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
