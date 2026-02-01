import express from "express";
import { getAdminStats, getRevenueStats } from "../controllers/admin.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorize("admin"),
  getAdminStats
);

router.get(
  "/revenue",
  authMiddleware,
  authorize("admin"),
  getRevenueStats
)

  export default router;
