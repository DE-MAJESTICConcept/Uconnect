import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { getAdminProfile, getAllStudentData, fetchAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin-only routes
router.get("/profile", protect, requireAdmin, getAdminProfile);
router.get("/students", protect, requireAdmin, getAllStudentData);
router.post("/fetch", protect, requireAdmin, fetchAdmin);

export default router;



