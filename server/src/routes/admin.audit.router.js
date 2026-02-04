import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { getAuditLogs } from "../controllers/admin.audit.controller.js";

const router = express.Router();

// 🔐 Admin only
router.get(
  "/audit-logs",
  authMiddleware,
  authorize("admin"),
  getAuditLogs
);

export default router;
