import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// Register user
export const registerUser = asyncHandler(async (req, res) => {
  // TODO: Add User model logic
  res.status(201).json({ success: true, message: "User registered" });
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  // TODO: Add User auth logic
  res.status(200).json({ success: true, message: "User logged in" });
});
