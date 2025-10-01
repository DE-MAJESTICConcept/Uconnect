
import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  listIncomingRequests,
  listFriends,
  unfriend,
  listMessagedFriends,
} from "../controllers/friend.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Friends Routes (all protected)
 * Base URL: /api/friends
 */

// ✅ Get all current friends
router.get("/", protect, listFriends);

// ✅ Get incoming friend requests
router.get("/requests", protect, listIncomingRequests);

// ✅ Send a friend request
router.post("/request/:id", protect, sendFriendRequest);

// ✅ Accept a friend request
router.post("/accept/:id", protect, acceptFriendRequest);

// ✅ Reject a friend request
router.post("/reject/:id", protect, rejectFriendRequest);

// ✅ Unfriend someone
router.delete("/:id", protect, unfriend);

// ✅ Get friends you’ve messaged
router.get("/messaged", protect, listMessagedFriends);

export default router;
