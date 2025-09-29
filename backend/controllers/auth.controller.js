
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Profile (for logged-in user)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// // ============================
// // FORGOT PASSWORD
// // ============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    `;

    await sendEmail(user.email, "Password Reset Request", message);

    res.json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending password reset email", error: err.message });
  }
};




// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // sign token (expires in 15 mins)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // store hashed token (optional if you want DB storage)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // send email
    await sendEmail(user.email, "Password Reset Request", `Reset your password using this link: ${resetUrl}`);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Invalid token or user not found" });

    // update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ============================
// UPDATE PROFILE
// ============================
export const updateProfile = async (req, res) => {
  try {
    const { name, profile } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (profile) {
      user.profile.department = profile.department || user.profile.department;
      user.profile.year = profile.year || user.profile.year;
      user.profile.matricNumber = profile.matricNumber || user.profile.matricNumber;
    }

    await user.save();

    const { password, ...userWithoutPassword } = user._doc;

    res.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};










// import User from "../models/user.models.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import sendEmail from "../services/sendEmail.js"; // email service

// // ============================
// // REGISTER
// // ============================
// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role, profile } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       profile: {
//         department: profile?.department,
//         year: profile?.year,
//         matricNumber: profile?.matricNumber,
//       },
//     });

//     await user.save();

//     const { password: pwd, ...userWithoutPassword } = user._doc;

//     res.status(201).json({
//       message: "User registered successfully",
//       user: userWithoutPassword,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error registering user", error: err.message });
//   }
// };

// // ============================
// // LOGIN
// // ============================
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     const { password: pwd, ...userWithoutPassword } = user._doc;

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: userWithoutPassword,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error logging in", error: err.message });
//   }
// };

// // ============================
// // FORGOT PASSWORD
// // ============================
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

//     user.resetPasswordToken = resetTokenHash;
//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
//     await user.save();

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     const message = `
//       <h2>Password Reset Request</h2>
//       <p>Please click the link below to reset your password:</p>
//       <a href="${resetUrl}" target="_blank">${resetUrl}</a>
//     `;

//     await sendEmail(user.email, "Password Reset Request", message);

//     res.json({ message: "Password reset link sent to email" });
//   } catch (err) {
//     res.status(500).json({ message: "Error sending password reset email", error: err.message });
//   }
// };


// // ============================
// // GET PROFILE
// // ============================
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching profile", error: err.message });
//   }
// };

// // Request password reset
// export const requestPasswordReset = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

//     // sign token (expires in 15 mins)
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "15m",
//     });

//     // store hashed token (optional if you want DB storage)
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
//     await user.save();

//     // send email
//     await sendEmail(user.email, "Password Reset Request", `Reset your password using this link: ${resetUrl}`);

//     res.json({ message: "Password reset email sent" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Reset password
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ message: "Invalid token or user not found" });

//     // update password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ message: "Password reset successful" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// // ============================
// // UPDATE PROFILE
// // ============================
// export const updateProfile = async (req, res) => {
//   try {
//     const { name, profile } = req.body;

//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (name) user.name = name;
//     if (profile) {
//       user.profile.department = profile.department || user.profile.department;
//       user.profile.year = profile.year || user.profile.year;
//       user.profile.matricNumber = profile.matricNumber || user.profile.matricNumber;
//     }

//     await user.save();

//     const { password, ...userWithoutPassword } = user._doc;

//     res.json({
//       message: "Profile updated successfully",
//       user: userWithoutPassword,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating profile", error: err.message });
//   }
// };


// // Get all users (Admin only)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // exclude password
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get single user by ID (Admin only)
// export const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Delete user (Admin only)
// export const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
