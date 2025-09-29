// src/components/Messages.jsx
import React, { useState, useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages"; // named export
import { getConversationsApi } from "../../api/messagesService";
import { useLocation } from "react-router-dom";

export default function Messages() {
  const token = localStorage.getItem("token");
  const rawUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Normalize user id
  const userId = rawUser?._id || rawUser?.id || null;

  // ✅ read optional conversation id from query ?c=<id>
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const conversationFromQuery = queryParams.get("c");

  // local state
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(conversationFromQuery || null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // messages hook
  const { messages, loading, loadMessages, sendMessage } = useMessages();

  const messagesEndRef = useRef(null);

  // Debug
  console.log("🔑 Logged in user (raw):", rawUser, "➡ userId:", userId);

  // Fetch conversations
  useEffect(() => {
    if (!token) {
      console.warn("No token - skipping conversations fetch");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const data = await getConversationsApi();
        console.log("📂 Conversations loaded:", data);
        if (mounted) setConversations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching conversations:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  // ✅ If query param changes, update selected conversation
  useEffect(() => {
    if (conversationFromQuery) {
      console.log("🔄 Setting conversation from query:", conversationFromQuery);
      setSelectedConvId(conversationFromQuery);
    }
  }, [conversationFromQuery]);

  // Load messages when selected conversation changes
  useEffect(() => {
    if (!selectedConvId) return;
    loadMessages(selectedConvId);
  }, [selectedConvId, loadMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("📨 Current messages:", messages);
  }, [messages]);

  // Utils
  const getSenderId = (sender) => {
    if (!sender) return null;
    if (typeof sender === "string") return sender;
    return sender._id || sender.id || null;
  };

  const buildFileUrl = (filePath) => {
    if (!filePath) return null;
    if (/^https?:\/\//i.test(filePath)) return filePath;
    const cleaned = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
    if (cleaned.startsWith("uploads/")) {
      return `http://localhost:5000/${cleaned}`;
    }
    return `http://localhost:5000/uploads/${cleaned}`;
  };

  // Handlers
  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedConvId) {
      console.warn("No conversation selected - cannot send message");
      return;
    }
    if (!text.trim() && !file) return;

    console.log("📤 Sending message:", { conversationId: selectedConvId, text, file });

    try {
      const sent = await sendMessage(selectedConvId, text, file);
      console.log("✅ Sent message result:", sent);
      setText("");
      setFile(null);
    } catch (err) {
      console.error("❌ Send failed:", err);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    console.log("📎 File chosen:", f);
    setFile(f);
  };

  const findFriend = (conv) => {
    if (!conv || !Array.isArray(conv.participants)) return null;
    return conv.participants.find((p) => {
      const pid = p?._id || p?.id || p;
      return pid && pid.toString() !== userId?.toString();
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
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
                onClick={() => {
                  console.log("👆 Selecting conversation", conv._id);
                  setSelectedConvId(conv._id);
                }}
                className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100 ${
                  conv._id === selectedConvId
                    ? "bg-gradient-to-r from-purple-800 to-yellow-500 text-white"
                    : ""
                }`}
              >
                <img
                  src={friend?.profile?.avatar || "/default-avatar.png"}
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
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-800 to-yellow-500 text-white font-semibold">
          {(() => {
            const conv = conversations.find((c) => c._id === selectedConvId);
            const friend = conv ? findFriend(conv) : null;
            return friend?.name || "Chat";
          })()}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-gray-500">Loading messages...</div>
          ) : !messages || messages.length === 0 ? (
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
                    className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
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
                            className="max-w-[200px] max-h-[200px] rounded cursor-pointer"
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

        {/* Send form */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t flex items-center gap-3 bg-white"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2"
            placeholder={
              selectedConvId
                ? "Type a message..."
                : "Select a chat to start messaging"
            }
            disabled={!selectedConvId}
          />
          <input type="file" onChange={handleFileChange} disabled={!selectedConvId} />
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-800 to-yellow-500 text-white font-semibold shadow"
            disabled={!selectedConvId}
          >
            Send
          </button>
        </form>
      </div>

      {/* Preview */}
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













// // src/components/Messages.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useMessages } from "../../hooks/useMessages"; // named export
// import { getConversationsApi } from "../../api/messagesService";
// import { useLocation } from "react-router-dom";

// /**
//  * Fully standalone Messages component.
//  * - Expects useMessages hook: { messages, loading, loadMessages, sendMessage }
//  * - Expects messagesService.getConversationsApi()
//  * - Normalizes user id (_id or id)
//  * - Robust file URL handling (handles backslashes and missing /uploads prefix)
//  */

// export default function Messages() {
//   const token = localStorage.getItem("token");
//   const rawUser = JSON.parse(localStorage.getItem("user") || "{}");

//   // Normalize user id (backend may send either `id` or `_id`)
//   const userId = rawUser?._id || rawUser?.id || null;

//   // read optional conversation id from query ?c=<id>
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const conversationFromQuery = queryParams.get("c");

//   // local state
//   const [conversations, setConversations] = useState([]);
//   const [selectedConvId, setSelectedConvId] = useState(conversationFromQuery || null);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   // messages hook (no-arg usage)
//   const { messages, loading, loadMessages, sendMessage } = useMessages();

//   const messagesEndRef = useRef(null);

//   // Debug: show the current logged user
//   console.log("🔑 Logged in user (raw):", rawUser, "➡ userId:", userId);

//   // Fetch conversations on mount (only if token exists)
//   useEffect(() => {
//     if (!token) {
//       console.warn("No token - skipping conversations fetch");
//       return;
//     }

//     let mounted = true;
//     (async () => {
//       try {
//         const data = await getConversationsApi();
//         console.log("📂 Conversations loaded:", data);
//         if (mounted) setConversations(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("❌ Error fetching conversations:", err);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [token]);

//   // Load messages each time selected conversation changes
// useEffect(() => {
//   if (!selectedConvId) return;
//   loadMessages(selectedConvId);
// }, [selectedConvId, loadMessages]);

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     console.log("📨 Current messages:", messages);
//   }, [messages]);

//   // Utility: ensure senderId extracted reliably
//   const getSenderId = (sender) => {
//     if (!sender) return null;
//     if (typeof sender === "string") return sender;
//     return sender._id || sender.id || null;
//   };

//   // Utility: builds a safe full URL for file paths returned by server
//   const buildFileUrl = (filePath) => {
//     if (!filePath) return null;
//     // If already absolute URL, use it
//     if (/^https?:\/\//i.test(filePath)) return filePath;

//     // Normalize backslashes to slashes and remove leading slashes
//     const cleaned = filePath.replace(/\\/g, "/").replace(/^\/+/, "");

//     // If backend stores with uploads prefix included, avoid double prefix,
//     // otherwise use /uploads/ as default if it looks like a filename.
//     if (cleaned.startsWith("uploads/")) {
//       return `http://localhost:5000/${cleaned}`;
//     }
//     // if cleaned already contains folder (uploads\...), we already handled above
//     // fallback to uploads
//     return `http://localhost:5000/uploads/${cleaned}`;
//   };

//   // Send message handler
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!selectedConvId) {
//       console.warn("No conversation selected - cannot send message");
//       return;
//     }
//     if (!text.trim() && !file) return;

//     console.log("📤 Sending message:", { conversationId: selectedConvId, text, file });

//     try {
//       // call hook's sendMessage(conversationId, text, file)
//       const sent = await sendMessage(selectedConvId, text, file);
//       console.log("✅ Sent message result:", sent);
//       setText("");
//       setFile(null);
//     } catch (err) {
//       console.error("❌ Send failed:", err);
//     }
//   };

//   // File input
//   const handleFileChange = (e) => {
//     const f = e.target.files?.[0] || null;
//     console.log("📎 File chosen:", f);
//     setFile(f);
//   };

//   // Helper: find friend in conversation participants
//   const findFriend = (conv) => {
//     if (!conv || !Array.isArray(conv.participants)) return null;
//     // participants are normalized to objects with _id (service/hook should do this)
//     return conv.participants.find((p) => {
//       const pid = p?._id || p?.id || p;
//       return pid && pid.toString() !== userId?.toString();
//     });
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-white border-r overflow-y-auto">
//         <h2 className="p-4 font-bold text-lg text-purple-800">Chats</h2>

//         {conversations.length === 0 && (
//           <div className="p-4 text-gray-500 text-sm">No conversations yet</div>
//         )}

//         <ul>
//           {conversations.map((conv) => {
//             const friend = findFriend(conv);
//             return (
//               <li
//                 key={conv._id}
//                 onClick={() => {
//                   console.log("👆 Selecting conversation", conv._id);
//                   setSelectedConvId(conv._id);
//                 }}
//                 className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100 ${
//                   conv._id === selectedConvId ? "bg-gradient-to-r from-purple-800 to-yellow-500 text-white" : ""
//                 }`}
//               >
//                 <img
//                   src={friend?.profile?.avatar || "/default-avatar.png"}
//                   alt={friend?.name || "Friend"}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <div className="font-semibold text-sm truncate">
//                     {friend?.name || friend?.username || "Unknown"}
//                   </div>
//                   <div className="text-xs text-gray-500 truncate max-w-[160px]">
//                     {conv.lastMessage?.text
//                       ? conv.lastMessage.text
//                       : conv.lastMessage?.file
//                       ? "📎 Attachment"
//                       : "No messages yet"}
//                   </div>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </div>

//       {/* Chat area */}
//       <div className="flex-1 flex flex-col bg-gray-50">
//         {/* Header */}
//         <div className="p-4 border-b bg-gradient-to-r from-purple-800 to-yellow-500 text-white font-semibold">
//           {(() => {
//             const conv = conversations.find((c) => c._id === selectedConvId);
//             const friend = conv ? findFriend(conv) : null;
//             return friend?.name || "Chat";
//           })()}
//         </div>

//         {/* Messages list */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {loading ? (
//             <div className="text-gray-500">Loading messages...</div>
//           ) : (!messages || messages.length === 0) ? (
//             <div className="text-gray-500">No messages yet</div>
//           ) : (
//             messages.map((msg) => {
//               const senderId = getSenderId(msg.sender);
//               const isMine = senderId?.toString() === userId?.toString();

//               // safe file URL
//               const fileUrl = msg.file ? buildFileUrl(msg.file) : null;

//               return (
//                 <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
//                   {/* avatar for other person */}
//                   {!isMine && (
//                     <img
//                       src={msg.sender?.profile?.avatar || "/default-avatar.png"}
//                       alt={msg.sender?.name || "User"}
//                       className="w-8 h-8 rounded-full object-cover mr-2 self-end"
//                     />
//                   )}

//                   <div className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
//                     isMine ? "bg-green-800 text-white rounded-br-none" : "bg-white text-black border rounded-bl-none"
//                   }`}>
//                     {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}

//                     {fileUrl && (
//                       <div className="mt-2">
//                         {/\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl) ? (
//                           <img
//                             src={fileUrl}
//                             alt="attachment"
//                             className="max-w-[200px] max-h-[200px] rounded cursor-pointer"
//                             onClick={() => setPreviewImage(fileUrl)}
//                           />
//                         ) : (
//                           <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
//                             📎 {fileUrl.split("/").pop()}
//                           </a>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Send form */}
//         <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-3 bg-white">
//           <input
//             type="text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             className="flex-1 border rounded-full px-4 py-2"
//             placeholder={selectedConvId ? "Type a message..." : "Select a chat to start messaging"}
//             disabled={!selectedConvId}
//           />
//           <input type="file" onChange={handleFileChange} disabled={!selectedConvId} />
//           <button
//             type="submit"
//             className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-800 to-yellow-500 text-white font-semibold shadow"
//             disabled={!selectedConvId}
//           >
//             Send
//           </button>
//         </form>
//       </div>

//       {/* Fullscreen preview */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
//           onClick={() => setPreviewImage(null)}
//         >
//           <img src={previewImage} alt="preview" className="max-w-[90%] max-h-[90%] rounded" />
//         </div>
//       )}
//     </div>
//   );
// }
