import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import * as adminService from "../services/admin.services.js";

// ===============================
// 👥 USER MANAGEMENT
// ===============================

// Get All Users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// 🔁 Update User Role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("User not found", 404);

  user.role = role;
  await user.save();

  // 🧾 Audit Log
  await AuditLog.create({
    admin: req.user._id,
    action: "UPDATE_ROLE",
    target: user._id,
    metadata: { role },
  });

  res.status(200).json({
    success: true,
    message: "Role updated",
    user,
  });
});

// 🚫 Block / Unblock User
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("User not found", 404);

  user.isBlocked = !user.isBlocked;
  await user.save();

  // 🧾 Audit Log
  await AuditLog.create({
    admin: req.user._id,
    action: user.isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
    target: user._id,
  });

  res.status(200).json({
    success: true,
    message: user.isBlocked ? "User blocked" : "User unblocked",
  });
});

// ❌ Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("User not found", 404);

  await user.deleteOne();

  // 🧾 Audit Log
  await AuditLog.create({
    admin: req.user._id,
    action: "DELETE_USER",
    target: user._id,
  });

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});

// ===============================
// 📊 ADMIN DASHBOARD (FUTURE)
// ===============================

export const getAdminStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError("Not authorized", 403);
  }

  const stats = await adminService.getAdminStatsService();

  res.status(200).json({
    success: true,
    stats,
  });
});

export const getRevenueStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError("Not authorized", 403);
  }

  const revenueStats = await adminService.getRevenueStatsService();

  res.status(200).json({
    success: true,
    revenue: revenueStats,
  });
});
