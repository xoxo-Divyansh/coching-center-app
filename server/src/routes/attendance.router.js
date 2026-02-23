import { Router } from "express";
import {
  markAttendance,
  getBatchAttendance,
} from "../controllers/attendance.controller.js";
import auth from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = Router();

router.post("/", auth, authorize("teacher", "admin"), markAttendance);
router.get(
  "/batch/:id",
  auth,
  authorize("teacher", "admin"),
  getBatchAttendance
);

export default router;
