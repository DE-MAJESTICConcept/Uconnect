// src/api/conversationsService.js
import api from "./axios";

export const getConversations = async () => {
  const { data } = await api.get("/conversations");
  return Array.isArray(data) ? data : data.conversations || [];
};

export const ensureConversation = async (participantId) => {
  const { data } = await api.post("/conversations", { participantId });
  return data; // { _id, participants, ... }
};

export const getMessages = async (conversationId, page = 1, limit = 30) => {
  const { data } = await api.get(`/conversations/${conversationId}/messages`, {
    params: { page, limit },
  });
  return Array.isArray(data) ? data : data.messages || [];
};

export const sendMessage = async (conversationId, { content, files = [] }) => {
  const form = new FormData();
  if (content) form.append("content", content);
  files.forEach((f) => form.append("media", f));
  const { data } = await api.post(`/conversations/${conversationId}/messages`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { message }
};

export const markRead = async (conversationId) => {
  await api.post(`/conversations/${conversationId}/read`);
};

export default {
  getConversations,
  ensureConversation,
  getMessages,
  sendMessage,
  markRead,
};
