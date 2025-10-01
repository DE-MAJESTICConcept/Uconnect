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







