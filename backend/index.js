// backend/index.js
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import http from "http";
import { Server as IOServer } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js"; // your DB connection
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import messageRoute from "./routes/message.route.js";
import friendsRoutes from "./routes/friends.routes.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.routes.js";
import itemRoutes from "./routes/items.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import stylesRoutes from "./routes/styles.routes.js";
import studentLearningRoutes from "./routes/studentLearning.routes.js";



dotenv.config();
const app = express();

// ✅ Allow only your frontend origin
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://uconnect-gkd3.onrender.com

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // if you’re sending cookies/tokens
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes (API)
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute); // <-- mount message routes at /api/messages
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/styles", stylesRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/student-learning", studentLearningRoutes);



// Static uploads folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Connect DB first (so controllers can use DB)
connectDB();

// Create HTTP server (so Socket.IO can attach)
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Create Socket.IO server
const io = new IOServer(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// OPTIONAL: verify JWT on socket handshake (recommended for production)
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization || "").split(" ")[1];
    if (!token) return next(); // allow unauth for dev; change to reject if you want to force auth
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = { _id: payload.id || payload._id || payload.userId };
    return next();
  } catch (err) {
    console.warn("Socket auth failed:", err?.message || err);
    // If you want to reject unauthorized sockets, call next(new Error("Unauthorized"))
    // For now we'll allow connection but without socket.user
    return next();
  }
});

io.on("connection", (socket) => {
  const uid = socket.user?._id;
  console.log("Socket connected:", socket.id, "user:", uid ?? "anonymous");

  // join a personal room so server can emit to a user easily
  if (uid) socket.join(`user:${uid}`);

  // join conversation rooms on demand
  socket.on("conversation:join", ({ conversationId }) => {
    if (conversationId) {
      socket.join(`conversation:${String(conversationId)}`);
    }
  });

  // Lightweight relay events for optimistic clients (keep server as source-of-truth)
  socket.on("message:send", (payload) => {
    try {
      const { to, from, conversationId, message } = payload || {};
      if (to) {
        io.to(String(to)).emit("message:received", { conversationId, message, from });
      }
      if (from) {
        io.to(String(from)).emit("message:sent:ack", { conversationId, message });
      }
    } catch (err) {
      console.error("Error handling message:send", err);
    }
  });

  socket.on("message:read", (payload) => {
    try {
      const { conversationId, by, forUser } = payload || {};
      if (forUser) {
        io.to(String(forUser)).emit("message:read", { conversationId, by });
      }
    } catch (err) {
      console.error("message:read error", err);
    }
  });

  socket.on("friend:request", (payload) => {
    try {
      const { from, to } = payload || {};
      if (to) io.to(String(to)).emit("friend:request:received", { from });
    } catch (err) {
      console.error("friend:request relay error", err);
    }
  });

  socket.on("friend:accepted", (payload) => {
    try {
      const { from, to } = payload || {};
      if (to) io.to(String(to)).emit("friend:accepted", { from });
    } catch (err) {
      console.error("friend:accepted relay error", err);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected", socket.id, "reason:", reason);
  });
});

// expose io to controllers/routes
app.set("io", io);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
