import express from 'express';
import User from '../models/User.js';
import Recycle from '../models/Recycle.js';

const router = express.Router();

// Get user points
router.get('/:userId/points', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ points: user.points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user recycle history
router.get('/:userId/recycles', async (req, res) => {
  try {
    const history = await Recycle.find({ userId: req.params.userId });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
