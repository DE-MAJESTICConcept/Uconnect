import React, { useState, useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { getConversationsApi } from "../../api/messagesService";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Messages() {
  const token = localStorage.getItem("token");
  const rawUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = rawUser?._id || rawUser?.id || null;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const conversationFromQuery = queryParams.get("c");

  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(conversationFromQuery || null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { messages, loading, loadMessages, sendMessage } = useMessages();
  const messagesEndRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getConversationsApi();
        setConversations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching conversations:", err);
      }
    })();
  }, [token]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConvId) loadMessages(selectedConvId);
  }, [selectedConvId, loadMessages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getSenderId = (sender) =>
    typeof sender === "string" ? sender : sender?._id || sender?.id || null;

  const buildFileUrl = (filePath) => {
    if (!filePath) return null;
    if (/^https?:\/\//i.test(filePath)) return filePath;
    const cleaned = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
    return `http://localhost:5000/${cleaned.startsWith("uploads/") ? cleaned : "uploads/" + cleaned}`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedConvId || (!text.trim() && !file)) return;
    try {
      await sendMessage(selectedConvId, text, file);
      setText("");
      setFile(null);
    } catch (err) {
      console.error("❌ Send failed:", err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files?.[0] || null);

  const findFriend = (conv) =>
    conv?.participants?.find((p) => {
      const pid = p?._id || p?.id || p;
      return pid && pid.toString() !== userId?.toString();
    });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-white border-r overflow-y-auto transition-all duration-300 
          ${selectedConvId ? "hidden md:block md:w-1/4" : "w-full md:w-1/4"}`}
      >
        <h2 className="p-4 font-bold text-lg text-purple-800">Chats</h2>
        {conversations.length === 0 && (
          <div className="p-4 text-gray-500 text-sm">No conversations yet</div>
        )}
        <ul>
          {conversations.map((conv) => {
            const friend = findFriend(conv);
            return (
              <li
                key={conv._id}
                onClick={() => setSelectedConvId(conv._id)}
                className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100 ${
                  conv._id === selectedConvId
                    ? "bg-gradient-to-r from-purple-800 to-yellow-500 text-white"
                    : ""
                }`}
              >
                <img
                  src={friend?.user?.avatar || "/default-avatar.png"}
                  alt={friend?.name || "Friend"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {friend?.name || friend?.username || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[160px]">
                    {conv.lastMessage?.text
                      ? conv.lastMessage.text
                      : conv.lastMessage?.file
                      ? "📎 Attachment"
                      : "No messages yet"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chat area */}
      <div
        className={`flex flex-col bg-gray-50 transition-all duration-300 
          ${selectedConvId ? "flex-1" : "hidden md:flex md:flex-1"}`}
      >
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-800 to-yellow-500 text-white flex items-center gap-3">
          {/* Back button on mobile */}
          <button
            className="md:hidden"
            onClick={() => setSelectedConvId(null)}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold">
            {(() => {
              const conv = conversations.find((c) => c._id === selectedConvId);
              const friend = conv ? findFriend(conv) : null;
              return friend?.name || "Chat";
            })()}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="text-gray-500">Loading messages...</div>
          ) : !messages?.length ? (
            <div className="text-gray-500">No messages yet</div>
          ) : (
            messages.map((msg) => {
              const senderId = getSenderId(msg.sender);
              const isMine = senderId?.toString() === userId?.toString();
              const fileUrl = msg.file ? buildFileUrl(msg.file) : null;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <img
                      src={msg.sender?.profile?.avatar || "/default-avatar.png"}
                      alt={msg.sender?.name || "User"}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] sm:max-w-xs break-words shadow ${
                      isMine
                        ? "bg-green-800 text-white rounded-br-none"
                        : "bg-white text-black border rounded-bl-none"
                    }`}
                  >
                    {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
                    {fileUrl && (
                      <div className="mt-2">
                        {/\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl) ? (
                          <img
                            src={fileUrl}
                            alt="attachment"
                            className="max-w-full sm:max-w-[200px] max-h-[200px] rounded cursor-pointer"
                            onClick={() => setPreviewImage(fileUrl)}
                          />
                        ) : (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-700"
                          >
                            📎 {fileUrl.split("/").pop()}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 border-t flex items-center gap-2 sm:gap-3 bg-white"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-full px-3 py-2 text-sm sm:text-base"
            placeholder={
              selectedConvId ? "Type a message..." : "Select a chat to start messaging"
            }
            disabled={!selectedConvId}
          />
          <input
            type="file"
            onChange={handleFileChange}
            disabled={!selectedConvId}
            className="hidden sm:block"
          />
          <button
            type="submit"
            className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-purple-800 to-yellow-500 text-white font-semibold shadow text-sm sm:text-base"
            disabled={!selectedConvId}
          >
            Send
          </button>
        </form>
      </div>

      {/* Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] rounded"
          />
        </div>
      )}
    </div>
  );
}
