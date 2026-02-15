import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import * as adminService from "../services/admin.services.js";
import { isValidRole } from "../utils/validators.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!isValidRole(role)) {
    throw new ApiError("Invalid role", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("User not found", 404);

  user.role = role;
  await user.save();

  await AuditLog.create({
    admin: req.user._id,
    action: "UPDATE",
    entity: "User",
    entityId: user._id,
    metadata: { updateType: "role", role },
  });

  res.status(200).json({
    success: true,
    message: "Role updated",
    user,
  });
});

export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("User not found", 404);

  user.isBlocked = !user.isBlocked;
  await user.save();

  await AuditLog.create({
    admin: req.user._id,
    action: "UPDATE",
    entity: "User",
    entityId: user._id,
    metadata: {
      updateType: "block_status",
      isBlocked: user.isBlocked,
    },
  });

  res.status(200).json({
    success: true,
    message: user.isBlocked ? "User blocked" : "User unblocked",
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError("User not found", 404);

  await user.deleteOne();

  await AuditLog.create({
    admin: req.user._id,
    action: "DELETE",
    entity: "User",
    entityId: user._id,
    metadata: { deleteType: "user" },
  });

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});

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
