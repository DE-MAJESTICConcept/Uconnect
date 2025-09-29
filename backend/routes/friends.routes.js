// import express from "express";
// import User from "..//models/user.models.js";
// import { protect } from "..//middleware/authMiddleware.js";
// import FriendRequest from "../models/friendRequest.model.js";

// const router = express.Router();

// /**
//  * @route   GET /api/friends
//  * @desc    Get current user's friends
//  * @access  Private
//  */
// router.get("/", protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .populate("friends", "name email profile.avatar");

//     res.json(user?.friends || []);
//   } catch (err) {
//     console.error("GET /friends error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * @route   GET /api/friends/requests
//  * @desc    Get incoming friend requests
//  * @access  Private
//  */

// router.get("/requests/incoming", protect, async (req, res) => {
//   try {
//     const requests = await FriendRequest.find({ to: req.user.id })
//       .populate("from", "name email profile.avatar");

//     res.json(requests);
//   } catch (err) {
//     console.error("GET /friends/requests/incoming error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/requests", protect, async (req, res) => {
//   try {
//     const requests = await FriendRequest.find({ to: req.user.id })
//       .populate("from", "name email profile.avatar");

//     res.json(requests);
//   } catch (err) {
//     console.error("GET /friends/requests error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



// /**
//  * @route   POST /api/friends/request/:id
//  * @desc    Send a friend request
//  * @access  Private
//  */
// router.post("/request/:id", protect, async (req, res) => {
//   try {
//     const targetId = req.params.id;

//     if (targetId === req.user.id) {
//       return res.status(400).json({ message: "You cannot add yourself" });
//     }

//     const sender = await User.findById(req.user.id);
//     const recipient = await User.findById(targetId);

//     if (!recipient) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (recipient.friendRequests.includes(sender._id) ||
//         recipient.friends.includes(sender._id)) {
//       return res.status(400).json({ message: "Already friends or pending request" });
//     }

//     recipient.friendRequests.push(sender._id);
//     await recipient.save();

//     res.json({ message: "Friend request sent" });
//   } catch (err) {
//     console.error("POST /friends/request error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * @route   POST /api/friends/accept/:id
//  * @desc    Accept a friend request
//  * @access  Private
//  */
// // Accept friend request
// router.post("/accept/:id", protect, async (req, res) => {
//   try {
//     const requestId = req.params.id;

//     // Find the friend request
//     const friendRequest = await FriendRequest.findById(requestId);
//     if (!friendRequest) {
//       return res.status(404).json({ message: "Friend request not found" });
//     }

//     // Check that the logged-in user is the receiver
//     if (String(friendRequest.to) !== String(req.user._id)) {
//       return res.status(403).json({ message: "Not authorized to accept this request" });
//     }

//     // Mark the request as accepted
//     friendRequest.status = "accepted";
//     await friendRequest.save();

//     // Add each other as friends (only if not already added)
//     const user = await User.findById(req.user._id);
//     const sender = await User.findById(friendRequest.from);

//     if (!user.friends.includes(sender._id)) {
//       user.friends.push(sender._id);
//     }
//     if (!sender.friends.includes(user._id)) {
//       sender.friends.push(user._id);
//     }

//     await user.save();
//     await sender.save();

//     res.json({
//       message: "Friend request accepted",
//       friend: {
//         _id: sender._id,
//         name: sender.name,
//         email: sender.email,
//         profile: sender.profile, // avatar etc.
//       },
//     });
//   } catch (err) {
//     console.error("POST /friends/accept error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// /**
//  * @route   POST /api/friends/reject/:id
//  * @desc    Reject a friend request
//  * @access  Private
//  */
// router.post("/reject/:id", protect, async (req, res) => {
//   try {
//     const requestorId = req.params.id;
//     const user = await User.findById(req.user.id);

//     if (!user.friendRequests.includes(requestorId)) {
//       return res.status(400).json({ message: "No request from this user" });
//     }

//     user.friendRequests = user.friendRequests.filter(
//       (id) => String(id) !== String(requestorId)
//     );

//     await user.save();

//     res.json({ message: "Friend request rejected" });
//   } catch (err) {
//     console.error("POST /friends/reject error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// /**
//  * @route   DELETE /api/friends/:id
//  * @desc    Unfriend a user
//  * @access  Private
//  */
// router.delete("/:id", protect, async (req, res) => {
//   try {
//     const friendId = req.params.id;
//     const user = await User.findById(req.user.id);
//     const friend = await User.findById(friendId);

//     if (!friend) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.friends = user.friends.filter((id) => String(id) !== String(friendId));
//     friend.friends = friend.friends.filter((id) => String(id) !== String(user._id));

//     await user.save();
//     await friend.save();

//     res.json({ message: "Unfriended successfully" });
//   } catch (err) {
//     console.error("DELETE /friends/:id error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
// backend/routes/friend.routes.js




// import express from "express";
// import User from "..//models/user.models.js";
// import { protect } from "..//middleware/authMiddleware.js";
// import FriendRequest from "../models/friendRequest.model.js";
// backend/routes/friends.routes.js
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
import { protect } from "../middleware/authmiddleware.js";

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
