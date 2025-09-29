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





// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/roleMiddleware.js";

// const router = express.Router();

// // Example admin-only route
// router.get("/dashboard", protect, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin! You have access to this dashboard." });
// });

// export default router;
