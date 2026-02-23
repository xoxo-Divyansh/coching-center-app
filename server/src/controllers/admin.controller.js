import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import * as adminService from "../services/admin.services.js";
import { isValidRole, isValidUserFilterRole } from "../utils/validators.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllUsers = asyncHandler(async (req, res) => {
  const {
    q = "",
    role = "all",
    page: rawPage = "1",
    limit: rawLimit = "10",
  } = req.query;
console.log("ADMIN USERS API HIT");

  const page = Math.max(parseInt(rawPage, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(rawLimit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (!isValidUserFilterRole(role)) {
    throw new ApiError("Invalid role filter", 400);
  }
  if (typeof q === "string" && q.trim()) {
    const searchRegex = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }
  if (role !== "all") {
    filter.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
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
