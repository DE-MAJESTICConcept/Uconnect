import { io } from "socket.io-client";

let socket = null;

export function initSocket() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token available. Socket will not connect.");
    return null;
  }

  // Check JWT expiry
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (Date.now() / 2000 > payload.exp) {
      console.warn("JWT expired. Socket will not connect. Please login again.");
      return null;
    }
  } catch {
    console.warn("Invalid JWT format. Socket will not connect.");
    return null;
  }

  if (socket && socket.connected) return socket;

  socket = io(import.meta.env.VITE_API_BASE_URL || "https://uconnect-backend-2qnn.onrender.com", {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("Socket connected", socket.id));
  socket.on("connect_error", (err) => console.warn("Socket connection error:", err.message));

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
