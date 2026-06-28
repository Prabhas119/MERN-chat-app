const Message = require("../models/message");
const mongoose = require("mongoose");

const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!receiverId || !content) return res.status(400).json({ message: "receiverId and content are required" });
    if (!mongoose.Types.ObjectId.isValid(receiverId)) return res.status(400).json({ message: "Invalid receiverId format" });

    const message = await Message.create({
      sender: req.user._id,
      receiver: new mongoose.Types.ObjectId(receiverId),
      content: content.trim(),
    });

    const populated = await Message.findById(message._id).populate("sender", "username email");
    res.status(201).json(populated);
  } catch (error) {
    console.error("❌ sendMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId" });

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).populate("sender", "username email").sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("❌ getMessages error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  const { senderId } = req.params;
  const myId = req.user._id;
  try {
    await Message.updateMany(
      { sender: senderId, receiver: myId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("❌ markAsRead error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Edit message
const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Only sender can edit
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this message" });
    }

    message.content = content.trim();
    message.isEdited = true;
    await message.save();

    const populated = await Message.findById(message._id).populate("sender", "username email");
    res.json(populated);
  } catch (error) {
    console.error("❌ editMessage error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete message
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Message deleted", messageId });
  } catch (error) {
    console.error("❌ deleteMessage error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages, markAsRead, editMessage, deleteMessage };
