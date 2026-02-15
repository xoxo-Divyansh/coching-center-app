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

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError("All fields are required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "student",   // 🔒 force student
    status: "active",
  });

  res.status(201).json({
    success: true,
    message: "Registration successful. Please login.",
  });
});


// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid credentials", 401);

  if (user.isBlocked) {
  throw new ApiError("Your account is blocked. Contact admin.", 403);
}
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError("Invalid credentials", 401);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// ✅ Get logged-in user
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
