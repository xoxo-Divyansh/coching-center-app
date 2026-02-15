import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
} from "../utils/validators.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!isNonEmptyString(name, 2) || !isValidEmail(email) || !isValidPassword(password)) {
    throw new ApiError("Invalid registration payload", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "student",
    status: "active",
  });

  res.status(201).json({
    success: true,
    message: "Registration successful. Please login.",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !isValidPassword(password)) {
    throw new ApiError("Invalid credentials", 401);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
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

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
