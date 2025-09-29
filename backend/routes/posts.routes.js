// backend/routes/posts.routes.js
import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  toggleLike,
  createComment,
} from "../controllers/posts.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getPosts);

// single post
router.get("/:id", getPostById);

// create post (up to 4 files under field 'media')
router.post("/", protect, upload.array("media", 4), createPost);

// like toggle
router.post("/:id/like", protect, toggleLike);

// add comment (optional media)
router.post("/:id/comments", protect, upload.array("media", 4), createComment);

router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
