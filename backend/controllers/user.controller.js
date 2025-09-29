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


















// import userSchema from "../models/user.models.js";

// export const fetchDetails = async (req, res) => {
//   const { _id } = req.body;

//   try {
//     // Finding the student by ID
//     const user = await userSchema.findById(_id);

//     if (!user) {
//       // If user not found, return an error response
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     // If user found, return the user data
//     res.status(200).json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     // If there's any error during the process, return a 500 status
//     console.error("Error fetching user details:", error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching user details',
//     });
//   }
// };


// export const getUsers = async (req, res) => {
//   try {
//     const data = [];

//     const users = await userSchema.find({}, "_id name rollno");
//     const teachers = await TeacherModel.find({}, "_id name teacher_id");

//     const formattedUsers = users.map((user) => ({
//       ...user._doc,
//       role: user.role,
//     }));

//     const formattedTeachers = teachers.map((teacher) => ({
//       ...teacher._doc,
//       role: "teacher",
//     }));

//     const allUsers = [...formattedStudents, ...formattedTeachers];

//     res.status(200).json({ message: "Fetched Successfully", data: allUsers });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// export const addFriend = async (req, res) => {
//   try {
//     const { _id, friendId ,role} = req.body;
//     console.log(role)
//     if (!_id || !friendId ) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }
//     const user1 = await userSchema.findById(_id);
//     const user2 = await userSchema.findById(friendId);

//     if (user1Student) {
//       if (!user1Student.friendsChat.includes(friendId)) {
//         user1Student.friendsChat.push(friendId);
//         await user1Student.save();
//       }

//       if (user2Student) {
//         if (!user2Student.friendsChat.includes(_id)) {
//           user2Student.friendsChat.push(_id);
//           await user2Student.save();
//         }
//       } else if (user2Teacher) {
//         if (!user2Teacher.friends.includes(_id)) {
//           user2Teacher.friends.push(_id);
//           await user2Teacher.save();
//         }
//       }

//       return res.status(200).json({ message: "Friendship added for Student" });
//     }

//     if (user1Teacher) {
//       if (!user1Teacher.friends.includes(friendId)) {
//         user1Teacher.friends.push(friendId);
//         await user1Teacher.save();
//       }

//       if (user2Student) {
//         if (!user2Student.friendsChat.includes(_id)) {
//           user2Student.friendsChat.push(_id);
//           await user2Student.save();
//         }
//       } else if (user2Teacher) {
//         if (!user2Teacher.friends.includes(_id)) {
//           user2Teacher.friends.push(_id);
//           await user2Teacher.save();
//         }
//       }

//       return res.status(200).json({ message: "Friendship added for Teacher" });
//     }

//     return res.status(404).json({ message: "User not found" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
