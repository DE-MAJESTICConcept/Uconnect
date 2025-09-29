// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    console.log('protect: authorization header ->', auth);

    if (!auth || !auth.startsWith('Bearer ')) {
      console.log('protect: no bearer token');
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('protect: decoded token ->', decoded);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('protect error:', err);
    res.status(401).json({ message: 'Not authorized' });
  }
};











// import jwt from "jsonwebtoken";
// import User from "../models/user.models.js";

// export const authMiddleware = async (req, res, next) => {
//   try {
//     // Get token from headers
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Attach user to request (without password)
//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid or expired token", error: err.message });
//   }
// };
