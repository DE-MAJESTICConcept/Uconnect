// src/api/messagesService.js
import axios from "axios";

const API_URL = "https://uconnect-backend-2qnn.onrender.com/api/messages";

// --- Normalize sender (_id or id or raw string) ---
const normalizeSender = (sender) => {
  if (!sender) return null;
  if (typeof sender === "string") return { _id: sender };
  return { _id: sender._id || sender.id || sender, ...sender };
};

// ✅ Get all conversations
export const getConversationsApi = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  const data = res.data;
  if (!Array.isArray(data)) return [];

  return data.map((conv) => ({
    ...conv,
    participants: conv.participants?.map((p) => normalizeSender(p)) || [],
    lastMessage: conv.lastMessage || null,
  }));
};

// ✅ Ensure a conversation exists (start new if none)
// ✅ Ensure a conversation exists (start new if none)
export const ensureConversation = async (friendId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/conversations`,
    { userId: friendId },  // 👈 changed from friendId → userId
    {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }
  );

  const conv = res.data;
  return {
    ...conv,
    participants: conv.participants?.map((p) => normalizeSender(p)) || [],
  };
};


// ✅ Get all messages for a conversation
export const getMessagesApi = async (conversationId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/${conversationId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  const data = res.data;
  if (!Array.isArray(data)) return [];

  return data.map((msg) => ({
    ...msg,
    sender: normalizeSender(msg.sender),
  }));
};

// ✅ Send a new message (with text and/or file)
export const sendMessageApi = async (conversationId, text, file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("conversationId", conversationId); // ⚡ backend needs this
  if (text) formData.append("text", text);
  if (file) formData.append("file", file);

  const res = await axios.post(`${API_URL}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  const msg = res.data;
  return { ...msg, sender: normalizeSender(msg.sender) };
};











// import axios from "axios";

// const API = "http://localhost:5000/api/messages";

// // 🛠 Helper: add Authorization header automatically
// const getHeaders = (token, isFormData = false) => ({
//   Authorization: `Bearer ${token}`,
//   ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
// });

// // --- Conversations ---

// // ✅ Ensure a conversation exists or create a new one
// export const ensureConversation = async (participantId, token) => {
//   if (!token) throw new Error("No token provided");
//   try {
//     const res = await axios.post(
//       `${API}/conversations`,
//       { participantId },
//       { headers: getHeaders(token) }
//     );
//     // Always return the conversation object itself
//     return res.data?.conversation ?? res.data;
//   } catch (err) {
//     console.error("Error ensuring conversation:", err);
//     throw err;
//   }
// };

// // ✅ Get all conversations for the logged-in user
// export const getConversations = async (token) => {
//   if (!token) throw new Error("No token provided");
//   try {
//     const res = await axios.get(`${API}/conversations`, {
//       headers: getHeaders(token),
//     });
//     return res.data || [];
//   } catch (err) {
//     console.error("Error fetching conversations:", err);
//     return [];
//   }
// };

// // --- Messages ---

// // ✅ Get messages for a conversation
// export const getMessages = async (conversationId, token) => {
//   if (!token) throw new Error("No token provided");
//   try {
//     const res = await axios.get(`${API}/${conversationId}/messages`, {
//       headers: getHeaders(token),
//     });
//     return res.data || [];
//   } catch (err) {
//     console.error("Error fetching messages:", err);
//     return [];
//   }
// };

// // ✅ Send message (text or file)
// export const sendMessage = async (data, token) => {
//   if (!token) throw new Error("No token provided");

//   let isFormData = data instanceof FormData;
//   try {
//     const res = await axios.post(API, data, {
//       headers: getHeaders(token, isFormData),
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Error sending message:", err);
//     throw err;
//   }
// };
// // src/api/messagesService.js
// // src/api/messagesService.js
