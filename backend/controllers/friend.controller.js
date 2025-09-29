// backend/controllers/friend.controller.js
import mongoose from "mongoose";
import User from "../models/user.models.js";
import FriendRequest from "../models/friendRequest.model.js";

/**
 * Helper to emit socket events safely
 */
const emitToUser = (app, userId, event, payload) => {
  try {
    const io = app.get("io");
    if (!io || !userId) return;
    io.to(`user:${String(userId)}`).emit(event, payload);
  } catch (err) {
    console.error("emitToUser error:", err);
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const fromId = req.user._id;
    const to = req.params.id || req.body.to;   // allow both param and body
    if (!to) return res.status(400).json({ message: "Missing 'to' user id" });
    if (String(fromId) === String(to)) return res.status(400).json({ message: "Cannot friend yourself" });

    const me = await User.findById(fromId).select("friends");
    if (me?.friends?.some((f) => String(f) === String(to))) {
      return res.status(400).json({ message: "Already friends" });
    }

    let doc;
    try {
      doc = await FriendRequest.create({ from: fromId, to });
    } catch (err) {
      if (err.code === 11000) {
        const existing = await FriendRequest.findOne({ from: fromId, to });
        return res.status(400).json({ message: "Request already sent", request: existing });
      }
      throw err;
    }

    // populate the request with sender details before emitting
    const populated = await FriendRequest.findById(doc._id).populate("from", "name profile.avatar").lean();

    // notify recipient with full request object for richer client UI
    emitToUser(req.app, to, "friend:request:received", { request: populated });

    res.status(201).json({ message: "Request sent", request: populated });
  } catch (err) {
    console.error("sendFriendRequest error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const reqDoc = await FriendRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: "Friend request not found" });
    if (String(reqDoc.to) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }
    if (reqDoc.status === "accepted") {
      return res.status(400).json({ message: "Already accepted" });
    }

    // ✅ Mark this request as accepted
    reqDoc.status = "accepted";
    await reqDoc.save();

    // ✅ Clean up any other pending requests between the same two users
    await FriendRequest.updateMany(
      {
        $or: [
          { from: reqDoc.from, to: reqDoc.to },
          { from: reqDoc.to, to: reqDoc.from }
        ],
        status: "pending"
      },
      { $set: { status: "accepted" } }
    );

    // ✅ Add both users as friends
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const fromUser = await User.findById(reqDoc.from).session(session);
      const toUser = await User.findById(reqDoc.to).session(session);

      if (!fromUser || !toUser) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "User not found" });
      }

      if (!Array.isArray(fromUser.friends)) fromUser.friends = [];
      if (!Array.isArray(toUser.friends)) toUser.friends = [];

      if (!fromUser.friends.some(f => String(f) === String(toUser._id))) {
        fromUser.friends.push(toUser._id);
      }
      if (!toUser.friends.some(f => String(f) === String(fromUser._id))) {
        toUser.friends.push(fromUser._id);
      }

      await fromUser.save({ session });
      await toUser.save({ session });

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    // ✅ Emit socket notifications
    emitToUser(req.app, reqDoc.from, "friend:accepted", {
      requestId: reqDoc._id,
      by: reqDoc.to,
    });
    emitToUser(req.app, reqDoc.to, "friend:confirmed", {
      with: reqDoc.from,
      requestId: reqDoc._id,
    });

    res.json({ message: "Friend request accepted", request: reqDoc });
  } catch (err) {
    console.error("acceptFriendRequest error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const reqDoc = await FriendRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: "Friend request not found" });
    if (String(reqDoc.to) !== String(userId)) return res.status(403).json({ message: "Not authorized to reject" });
    if (reqDoc.status === "accepted") return res.status(400).json({ message: "Already accepted" });

    reqDoc.status = "rejected";
    await reqDoc.save();

    emitToUser(req.app, reqDoc.from, "friend:rejected", { by: reqDoc.to, requestId: reqDoc._id });

    res.json({ message: "Friend request rejected", request: reqDoc });
  } catch (err) {
    console.error("rejectFriendRequest error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const listIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await FriendRequest.find({ to: userId, status: "pending" })
      .populate("from", "name profile.avatar")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ requests });
  } catch (err) {
    console.error("listIncomingRequests error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const listFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "name profile.avatar").select("friends");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ friends: user.friends || [] });
  } catch (err) {
    console.error("listFriends error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const unfriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.user._id;
    if (String(friendId) === String(userId)) return res.status(400).json({ message: "Cannot unfriend yourself" });

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await User.updateOne({ _id: userId }, { $pull: { friends: friendId } }).session(session);
      await User.updateOne({ _id: friendId }, { $pull: { friends: userId } }).session(session);

      await FriendRequest.deleteMany({
        $or: [
          { from: userId, to: friendId },
          { from: friendId, to: userId },
        ],
      }).session(session);

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    emitToUser(req.app, friendId, "friend:removed", { by: userId });

    res.json({ message: "Unfriended" });
  } catch (err) {
    console.error("unfriend error:", err);
    res.status(500).json({ error: err.message });
  }
};
// List only friends that user has actually messaged
import Conversation from "../models/conversation.model.js";

export const listMessagedFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: find conversations where the user is a participant
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name profile.avatar")
      .sort({ updatedAt: -1 });

    // Step 2: build a clean list of "friends you’ve messaged"
    const messagedFriends = conversations.map(convo => {
      const peer = convo.participants.find(
        p => String(p._id) !== String(userId)
      );
      return {
        conversationId: convo._id,
        peerId: peer?._id,
        peerName: peer?.name,
        peerAvatar: peer?.profile?.avatar,
        lastMessage: convo.lastMessage || "",
        updatedAt: convo.updatedAt,
      };
    });

    res.json({ friends: messagedFriends });
  } catch (err) {
    console.error("listMessagedFriends error:", err);
    res.status(500).json({ error: err.message });
  }
};
