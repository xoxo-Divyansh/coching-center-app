import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { getAdminStats, getRevenueStats,getAllUsers,updateUserRole,toggleBlockUser, deleteUser} from "../controllers/admin.controller.js";
import validateRequest from "../middlewares/validateRequest.middleware.js";
import {
  validateAdminUsersQuery,
  validateUpdateUserRole,
  validateUserIdParam,
} from "../validators/admin.validation.js";


const router = express.Router();


// 🔐 Admin only
router.use(authMiddleware, authorize("admin"));

// 👥 User Management
router.get("/users", validateAdminUsersQuery, validateRequest(), getAllUsers);
router.patch(
  "/users/:id/role",
  validateUserIdParam,
  validateUpdateUserRole,
  validateRequest(),
  updateUserRole,
);
router.patch(
  "/users/:id/block",
  validateUserIdParam,
  validateRequest(),
  toggleBlockUser,
);
router.delete("/users/:id", validateUserIdParam, validateRequest(), deleteUser);

// 🗄️ Dashboard
router.get("/dashboard", getAdminStats);
router.get("/revenue", getRevenueStats);


  export default router;
