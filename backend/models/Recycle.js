import mongoose from 'mongoose';

const recycleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: String,
  date: String,
  time: String,
  quantity: Number,
  address: String,
  status: { type: String, default: 'pending' },
});

export default mongoose.model('Recycle', recycleSchema);
