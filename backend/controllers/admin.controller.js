import User from "../models/user.models.js";

// ✅ Get all students
export const getAllStudentData = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const studentListData = await User.find({ role: "student" }).select("-password");

    if (!studentListData) {
      return res.status(404).json({ success: false, message: "No students found" });
    }

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      studentCount,
      studentData: studentListData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Fetch admin profile (based on role)
export const fetchAdmin = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ success: false, message: "Missing Required field" });
    }

    const admin = await User.findOne({ _id, role: "admin" }).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Secure admin profile for logged-in user
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    res.json({
      success: true,
      message: "Admin profile fetched successfully",
      admin,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin profile", error: err.message });
  }
};


