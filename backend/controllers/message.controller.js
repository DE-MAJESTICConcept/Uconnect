// controllers/message.controller.js
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

/**
 * Get all messages for a conversation
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name avatar email") // make sure sender is populated
      .sort({ createdAt: 1 });

    console.log("[getMessages] messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error("[getMessages] error:", error);
    res.status(500).json({ error: "Server error while fetching messages" });
  }
};

/**
 * Send a new message (text or file)
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body; // ✅ take from body now
    const senderId = req.user._id;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    // make sure conversation exists
    let conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const newMessage = new Message({
      conversation: conversationId,
      sender: senderId,
      text: text || "",
      file,
    });

    await newMessage.save();

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const populatedMessage = await newMessage.populate(
      "sender",
      "name avatar email"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("[sendMessage] error:", error);
    res.status(500).json({ error: "Server error while sending message" });
  }
};

/**
 * Create a new conversation or return existing one between 2 users
 */
export const ensureConversation = async (req, res) => {
  try {
    const { userId } = req.body; // friend ID
    const myId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [myId, userId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [myId, userId],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("[ensureConversation] error:", error);
    res.status(500).json({ error: "Server error while creating conversation" });
  }
};

/**
 * Get all conversations for the logged-in user
 */
export const getConversations = async (req, res) => {
  try {
    const myId = req.user._id;

    const conversations = await Conversation.find({
      participants: myId,
    })
      .populate("participants", "name avatar email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    console.log("[getConversations] list:", conversations);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("[getConversations] error:", error);
    res.status(500).json({ error: "Server error while fetching conversations" });
  }
};



// // controllers/message.controller.js
// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";


// // Ensure or create conversation
// export const ensureConversation = async (req, res) => {
//   try {
//     const { participantId } = req.body;

//     let conversation = await Conversation.findOne({
//       participants: { $all: [req.user._id, participantId] },
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [req.user._id, participantId],
//       });
//     }

//     res.json(conversation);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating conversation" });
//   }
// };

// // Get all conversations for logged-in user
// export const getConversations = async (req, res) => {
//   try {
//     const conversations = await Conversation.find({
//       participants: req.user._id,
//     }).populate("participants", "username name");

//     res.json(conversations);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching conversations" });
//   }
// };

// // Get messages for one conversation
// export const getMessages = async (req, res) => {
//   try {
//     const { conversationId } = req.params;

//     const messages = await Message.find({ conversation: conversationId })
//       .populate("sender", "name profile.avatar")
//       .sort({ createdAt: 1 });

//     // DEBUG LOG
//     console.log("📩 [Backend] Messages fetched from DB:", JSON.stringify(messages, null, 2));

//     res.json(messages);
//   } catch (err) {
//     console.error("❌ [Backend] getMessages error:", err);
//     res.status(500).json({ error: "Failed to fetch messages" });
//   }
// };
// // Send a message
// export const sendMessage = async (req, res) => {
//   try {
//     const { conversationId, text } = req.body;
//     const file = req.file ? `/uploads/${req.file.filename}` : null;

//     // Create the new message
//     let message = new Message({
//       conversation: conversationId,
//       sender: req.user._id,   // ✅ logged-in user as sender
//       text,
//       file,
//     });

//     await message.save();

//     // Update conversation's last message
//     await Conversation.findByIdAndUpdate(conversationId, {
//       lastMessage: text || "📎 Attachment",
//     });

//     // ✅ Populate sender before returning
//     message = await message.populate("sender", "name profile.avatar");

//     res.status(201).json(message);
//   } catch (err) {
//     console.error("Error sending message:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };