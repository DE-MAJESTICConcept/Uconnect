// =============================
// FILE: backend/controllers/profile.controller.js
// (merged: existing handlers + getProfileById)
// =============================
import User from "../models/user.models.js";
import FriendRequest from "../models/friendRequest.model.js"; // add at top of file with other imports

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, department, year, matricNumber, staffId, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (!user.profile) user.profile = {};
    if (department !== undefined) user.profile.department = department;
    if (bio !== undefined) user.profile.bio = bio;

    // files from multer
    if (req.files?.avatar?.[0]) {
      const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.avatar[0].filename}`;
      user.profile.avatar = avatarUrl;
    }
    if (req.files?.cover?.[0]) {
      const coverUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.cover[0].filename}`;
      user.profile.cover = coverUrl;
    }

    if (user.role === "student") {
      if (year !== undefined) user.profile.year = year;
      if (matricNumber !== undefined) user.profile.matricNumber = matricNumber; // consider server-side redaction on public
    }

    if (user.role === "staff") {
      if (staffId !== undefined) user.profile.staffId = staffId;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error("updateMyProfile error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("getAllProfiles error:", err);
    res.status(500).json({ error: err.message });
  }
};

// NEW: Public (or protect if you prefer) profile by id, with sensitive fields scrubbed
// in backend/controllers/profile.controller.js (replace existing getProfileById)


export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id; // logged-in user
    console.log("🔍 Fetching profile for id:", id, "requested by:", currentUserId);

    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Default friend status
    let friendStatus = "none";
    let friendRequestId = null;

    // Debug: log what we are checking
    console.log("👥 Friends in profile:", user.friends, "currentUserId:", currentUserId);

    if (String(user._id) === String(currentUserId)) {
      friendStatus = "self";
    } else {
      // ✅ FIX: compare ObjectIds as strings to detect friendship
      const isFriend = user.friends?.some(f => String(f) === String(currentUserId));
      if (isFriend) {
        friendStatus = "friends";
      } else {
        // Check friend requests
        const request = await FriendRequest.findOne({
          $or: [
            { from: currentUserId, to: user._id },
            { from: user._id, to: currentUserId },
          ],
        }).lean();

        if (request) {
          friendRequestId = request._id;
          if (String(request.from) === String(currentUserId)) {
            friendStatus = "requested_sent";
          } else {
            friendStatus = "requested_received";
          }
        }
      }
    }

    console.log("✅ Friend status calculated:", friendStatus, "for profile:", user._id);

    return res.json({
      ...user,
      friendStatus,
      friendRequestId,
    });
  } catch (err) {
    console.error("❌ Error in getProfileById:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMutualFriends = async (req, res) => {
  try {
    const targetId = req.params.id;
    const viewerId = req.user?._id;

    if (!viewerId) {
      // If viewer is not authenticated, return empty list (or you can make it public)
      return res.json({ mutuals: [], count: 0 });
    }

    if (String(viewerId) === String(targetId)) {
      // If the viewer is viewing their own profile, return their friends (limited)
      const me = await User.findById(viewerId).select("friends").lean();
      const friendsList = me?.friends || [];
      const friends = await User.find({ _id: { $in: friendsList } })
        .select("name profile.avatar")
        .limit(12)
        .lean();
      return res.json({ mutuals: friends, count: friendsList.length });
    }

    // Fetch both friends arrays
    const [target, viewer] = await Promise.all([
      User.findById(targetId).select("friends").lean(),
      User.findById(viewerId).select("friends").lean(),
    ]);

    if (!target || !viewer) {
      return res.status(404).json({ mutuals: [], count: 0 });
    }

    const targetFriends = Array.isArray(target.friends) ? target.friends.map(String) : [];
    const viewerFriends = Array.isArray(viewer.friends) ? viewer.friends.map(String) : [];

    // compute intersection (ids)
    const mutualIds = viewerFriends.filter((id) => targetFriends.includes(id));

    // limit results for payload (show up to 12)
    const LIMIT = 12;
    const mutualIdsLimited = mutualIds.slice(0, LIMIT);

    const mutuals = await User.find({ _id: { $in: mutualIdsLimited } })
      .select("name profile.avatar")
      .lean();

    return res.json({ mutuals, count: mutualIds.length });
  } catch (err) {
    console.error("getMutualFriends error:", err);
    return res.status(500).json({ error: err.message || "Failed to compute mutual friends" });
  }
};



// GET /api/profile/discover
export const discoverPeople = async (req, res) => {
  try {
    const myId = req.user._id;

    // get logged in user details
    const me = await User.findById(myId);

    // find users who are not me, not already my friend, and not already requested
    const users = await User.find({
      _id: { $ne: myId, $nin: [...me.friends, ...me.friendRequests] },
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error discovering people", error: err.message });
  }
};



