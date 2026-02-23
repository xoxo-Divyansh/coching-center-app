import {asyncHandler} from "../utils/asyncHandler.js";
import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("admin", "name email")
    .sort({ createdAt: -1 })
    .limit(100);

  res.status(200).json({
    success: true,
    count: logs.length,
    logs,
  });
});
