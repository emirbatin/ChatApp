import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message.trim(),
    });
    
    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
    }

    await Promise.all([gotConversation.save(), newMessage.save()]);

    // Gönderenin bilgilerini ekle (toast bildirimi için)
    const populatedMessage = await Message.findById(newMessage._id).populate('senderId', 'fullName profilePhoto');

    // SOCKET IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      const messageToEmit = {
        ...newMessage.toObject(),
        senderId: String(newMessage.senderId),
        receiverId: String(newMessage.receiverId),
        senderName: populatedMessage.senderId.fullName,
        senderPhoto: populatedMessage.senderId.profilePhoto,
      };
      io.to(receiverSocketId).emit("newMessage", messageToEmit);
    }
    
    return res.status(201).json({
      newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.id;
    
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
    .populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }
    })
    .lean();
    
    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    console.error("Error getting messages:", error);
    return res.status(500).json({ message: "Failed to get messages" });
  }
};
