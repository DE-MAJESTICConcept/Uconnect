import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], default: "image" },
});

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, trim: true },
  media: [MediaSchema],
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: [MediaSchema],
    category: { type: String, default: "General" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
