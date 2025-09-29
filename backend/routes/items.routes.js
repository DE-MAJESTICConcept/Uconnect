import express from "express";
import multer from "multer";
import {
  createItem,
  getItems,
  getItemById,
  updateItemStatus,
  deleteItem,
  getAllItem,
  searchItems,
  getRecentItems,
} from "../controllers/item.controller.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Public routes
router.get("/search", searchItems);
router.get("/recent", getRecentItems);
router.get("/", getItems);
router.get("/found", (req, res, next) => { req.query.status = "found"; next(); }, getItems);
router.get("/lost", (req, res, next) => { req.query.status = "lost"; next(); }, getItems);
router.get("/:id", getItemById);
router.post("/", upload.single("image"), createItem);

// Admin/staff (optional)
router.put("/:id/status", updateItemStatus);
router.delete("/:id", deleteItem);

export default router;
