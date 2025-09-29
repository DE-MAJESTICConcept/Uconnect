// src/hooks/useMessages.js
import { useState, useCallback } from "react";
import {
  getMessagesApi,
  sendMessageApi,
} from "../api/messagesService";

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Load messages for a conversation
   */
  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await getMessagesApi(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ stable reference

  /**
   * Send a new message (with text and/or file)
   */
  const sendMessage = useCallback(
    async (conversationId, text, file) => {
      if (!conversationId) return;
      try {
        const newMsg = await sendMessageApi(conversationId, text, file);
        setMessages((prev) => [...prev, newMsg]); // append locally
        return newMsg;
      } catch (error) {
        console.error("❌ Error sending message:", error);
        throw error;
      }
    },
    [] // ✅ stable reference
  );

  return {
    messages,
    loading,
    loadMessages,
    sendMessage,
  };
};



// // src/hooks/useMessages.js
// import { useState, useCallback } from "react";
// import { getMessagesApi, sendMessageApi } from "../api/messagesService";

// export const useMessages = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Load messages for a conversation
//   const loadMessages = useCallback(async (conversationId) => {
//     if (!conversationId) return;
//     setLoading(true);
//     try {
//       const data = await getMessagesApi(conversationId);
//       setMessages(data);
//     } catch (err) {
//       console.error("❌ loadMessages error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Send a message
//   const sendMessage = useCallback(async (conversationId, formData) => {
//     if (!conversationId) return;
//     try {
//       const newMsg = await sendMessageApi(conversationId, formData);
//       setMessages((prev) => [...prev, newMsg]);
//     } catch (err) {
//       console.error("❌ sendMessage error:", err);
//     }
//   }, []);

//   return { messages, loading, loadMessages, sendMessage };
// };
