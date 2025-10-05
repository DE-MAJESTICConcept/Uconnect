import express from 'express';
import multer from 'multer';
import Recycle from '../models/Recycle.js';
import User from '../models/user.models.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Test GET route for /api/recycles
router.get('/', (req, res) => {
  res.send('Recycle API is working!');
});

// Submit recycle form
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('--- POST /api/recycles ---');
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { userId, date, time, quantity, address } = req.body;
    if (!userId || !date || !time || !quantity || !address) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!req.file) {
      console.log('Image file not received');
      return res.status(400).json({ error: 'Image file not received' });
    }
    const image = req.file.path;
    const recycle = new Recycle({ userId, image, date, time, quantity, address });
    await recycle.save();
    // Optionally update user points
    await User.findByIdAndUpdate(userId, { $inc: { points: Number(quantity) } });
    console.log('Recycle saved:', recycle);
    res.json({ success: true, recycle });
  } catch (err) {
    console.error('Recycle POST error:', err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
