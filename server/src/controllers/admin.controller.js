import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
// import * as adminService from "../services/admin.service.js";

// 📊 Admin Dashboard Stats
export const getAdminStats = asyncHandler(async (req, res) => {
  // 🔐 Extra safety (optional but fine)
  if (req.user.role !== "admin") {
    throw new ApiError("Not authorized", 403);
  }

  const stats = await adminService.getAdminStatsService();

  res.status(200).json({
    success: true,
    stats,
  });
});


// 💰 Revenue Stats Controller
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