
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["student", "staff", "admin"], default: "student" },

    profile: {
      department: String,
      year: Number,
      matricNumber: String,
      staffId: String,
      bio: String,
      avatar: String,
      cover: String,
    },

    // ✅ Friend list
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ✅ Pending friend requests
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
