// backend/routes/profile.routes.js
import express from "express";
import multer from "multer";
import {
  getMyProfile,
  updateMyProfile,
  getAllProfiles,
  getProfileById,
  getMutualFriends,
} from "../controllers/profile.controller.js";

import { discoverPeople } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// configure multer to save files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists in your project root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/me", protect, getMyProfile);

// 👇 Fix: add multer middleware here
router.put(
  "/me",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateMyProfile
);

router.get("/", getAllProfiles);
router.get('/:id', protect, getProfileById); 
// router.get("/:id", getProfileById);
router.get("/discover", protect, discoverPeople);
router.get("/:id/mutual", protect, getMutualFriends);

export default router;

















// // backend/routes/profile.routes.js
// import express from "express";
// import {
//   getMyProfile,
//   updateMyProfile,
//   getAllProfiles,
//   getProfileById,
//   getMutualFriends, // <-- add this import if using same file
// } from "../controllers/profile.controller.js";

// import { discoverPeople } from "../controllers/user.controller.js";
// import { protect } from "../middleware/authMiddleware.js";




// const router = express.Router();

// router.get("/me", protect, getMyProfile);
// router.put("/me", protect, updateMyProfile);
// router.get("/", getAllProfiles);
// router.get("/:id", getProfileById);
// router.get("/discover", protect, discoverPeople);

// // NEW: mutual friends (viewer must be authenticated)
// router.get("/:id/mutual", protect, getMutualFriends);

// export default router;

