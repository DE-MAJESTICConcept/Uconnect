import User from "../models/user.models.js";

// ✅ Fetch user details
export const fetchDetails = async (req, res) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name role profile");

    res.status(200).json({
      message: "Fetched Successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Add Friend
export const addFriend = async (req, res) => {
  try {
    const { _id, friendId } = req.body;

    if (!_id || !friendId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user1 = await User.findById(_id);
    const user2 = await User.findById(friendId);

    if (!user1 || !user2) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicates
    if (!user1.friends.includes(friendId)) {
      user1.friends.push(friendId);
      await user1.save();
    }

    if (!user2.friends.includes(_id)) {
      user2.friends.push(_id);
      await user2.save();
    }

    return res.status(200).json({ message: "Friendship added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/users/discover
export const discoverPeople = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("name email profile");

    // normalize response
    const formatted = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      avatarUrl: u.profile?.avatar || null,
      coverUrl: u.profile?.cover || null,
      bio: u.profile?.bio || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("discoverPeople error:", err);
    res.status(500).json({ message: "Error fetching discover people", error: err.message });
  }
};



