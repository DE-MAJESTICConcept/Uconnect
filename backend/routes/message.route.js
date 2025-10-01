import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // ✅ middleware to check JWT
import multer from "multer";
import {
  ensureConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ✅ Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// --- Routes ---

// ✅ Ensure conversation exists or create one
router.post("/conversations", protect, ensureConversation);

// ✅ Get all conversations for logged-in user
router.get("/conversations", protect, getConversations);

// ✅ Get all messages in a conversation
router.get("/:conversationId/messages", protect, getMessages);

// ✅ Send new message (text or file)
router.post("/", protect, upload.single("file"), sendMessage);

export default router;


