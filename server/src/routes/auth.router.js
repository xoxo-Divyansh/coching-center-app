import express from "express";
import {
  getMe,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validateRequest from "../middlewares/validateRequest.middleware.js";
import { validateLogin, validateRegister } from "../validators/auth.validation.js";

const router = express.Router();

// Public routes
router.post("/register", validateRegister, validateRequest(), registerUser);
router.post("/login", validateLogin, validateRequest(), loginUser);

// 🔐 Protected route
router.get("/me", authMiddleware, getMe); 

router.get("/admin-test", authMiddleware, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
});
export default router;
