import mongoose from "mongoose";




const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // ✅ must reference User so populate works
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    file: {
      type: String,  // store file URL or path
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);


