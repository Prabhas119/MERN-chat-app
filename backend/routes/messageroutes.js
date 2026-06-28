
const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markAsRead,
  editMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.post("/send", protect, sendMessage);
router.get("/:userId", protect, getMessages);
router.put("/read/:senderId", protect, markAsRead);
router.put("/edit/:messageId", protect, editMessage);       // ✅ new
router.delete("/delete/:messageId", protect, deleteMessage); // ✅ new

module.exports = router;