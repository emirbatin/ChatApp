const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { encrypt, decrypt } = require("../utils/encryption");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const encryptedMessage = encrypt(message);
    const newMessage = new Message({
      senderId,
      receiverId,
      message: encryptedMessage.encryptedData,
      iv: encryptedMessage.iv,
    });

    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, userToChatId],
      },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const decryptedMessages = conversation.messages.map((msg) => {
      const decryptedMessage = decrypt({
        iv: msg.iv,
        encryptedData: msg.message,
      });
      return {
        ...msg._doc,
        message: decryptedMessage,
      };
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
