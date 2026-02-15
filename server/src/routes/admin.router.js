import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { getAdminStats, getRevenueStats,getAllUsers,updateUserRole,toggleBlockUser, deleteUser} from "../controllers/admin.controller.js";


const router = express.Router();


// 🔐 Admin only
router.use(authMiddleware, authorize("admin"));

// 👥 User Management
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

// 🗄️ Dashboard
router.get("/dashboard", getAdminStats);
router.get("/revenue", getRevenueStats);


  export default router;
