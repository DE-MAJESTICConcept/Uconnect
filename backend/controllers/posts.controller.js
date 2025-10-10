// backend/controllers/posts.controller.js

import Post from "../models/posts.models.js";
import User from "../models/user.models.js";

/** Convert multer files -> media objects */
/** Convert multer (CloudinaryStorage) files → media objects */
const filesToMedia = (files = []) => {
  if (!files || !files.length) return [];
  return files.map((f) => {
    const url = f.path || f.secure_url || f.url; // Cloudinary gives secure_url
    const type = (f.mimetype || "").startsWith("video/") ? "video" : "image";
    return { url, type };
  });
};


// GET /api/posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profile.avatar")
      .populate("comments.author", "name profile.avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("getAllPosts error:", err);
    res.status(500).json({ error: err.message });
  }
};



/**
 * GET /api/posts
 * Query params:
 *  - author (userId) : filter by author
 *  - limit (number)  : number of posts to return
 *  - page (number)   : pagination
 *  - category (str)  : optional category filter
 */
// GET /api/posts  (add comments author population)
export const getPosts = async (req, res) => {
  try {
    const { author, limit = 20, page = 1, category } = req.query;
    const q = {};
    if (author) q.author = author;
    if (category) q.category = category;

    const perPage = Math.min(100, Number(limit) || 20);
    const skip = (Math.max(1, Number(page)) - 1) * perPage;

    const [posts, total] = await Promise.all([
      Post.find(q)
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(skip)
        .populate("author", "name profile.avatar")
        .populate({ path: "comments.author", select: "name profile.avatar" }) // 👈 key line
        .lean(),
      Post.countDocuments(q),
    ]);

    res.json({ posts, total });
  } catch (err) {
    console.error("getPosts error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name profile.avatar").lean();
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json(post);
  } catch (err) {
    console.error("getPostById error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch post" });
  }
};


// POST /api/posts  (protected) - expects upload.array('media', 4)
export const createPost = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Not authenticated" });

    const { title, content, category } = req.body;
    if (!content || String(content).trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    const newPost = new Post({
      title: title || "",
      content,
      category: category || "General",
      author: req.user._id,
    });

    if (req.files && req.files.length) {
      newPost.media = filesToMedia(req.files, req);
    }

    const saved = await newPost.save();
    const populated = await Post.findById(saved._id).populate("author", "name profile.avatar");
    res.status(201).json(populated);
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/posts/:id/like  (protected) - toggle like
export const toggleLike = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Not authenticated" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    const idx = post.likes.findIndex((id) => id.toString() === userId);

    let liked;
    if (idx === -1) {
      post.likes.push(req.user._id);
      liked = true;
    } else {
      post.likes.splice(idx, 1);
      liked = false;
    }

    await post.save();
    res.json({ liked, likesCount: post.likes.length });
  } catch (err) {
    console.error("toggleLike error:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/posts/:id/comments  (protected) - expects upload.array('media', 4) optional
// POST /api/posts/:id/comments
export const createComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;

    // build media array if you accept uploads via multer
    const media = filesToMedia(req.files);

    const comment = {
      author: req.user._id,
      content,
      media,
      createdAt: new Date(),
    };

    // push comment and request the new comment populated
    const updated = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment }, $inc: { commentsCount: 1 } },
      { new: true }
    )
      .populate({ path: "comments.author", select: "name profile.avatar" });

    const newComment = updated.comments[updated.comments.length - 1];
    return res.json({ message: "Comment added", comment: newComment });
  } catch (e) {
    console.error("createComment error:", e);
    res.status(500).json({ error: e.message || "Failed to add comment" });
  }
};


// PUT /api/posts/:id (protected, owner/admin) - update title/content/category
export const updatePost = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Not authenticated" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, content, category } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;

    const updated = await post.save();
    const populated = await Post.findById(updated._id).populate("author", "name profile.avatar");
    res.json(populated);
  } catch (err) {
    console.error("updatePost error:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/posts/:id (protected, owner/admin)
export const deletePost = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Not authenticated" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ error: err.message });
  }
};
// export default { getAllPosts, getPostById, createPost, updatePost, deletePost, toggleLike, createComment };
