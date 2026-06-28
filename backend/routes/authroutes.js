const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  searchUsers,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, getAllUsers);
router.get("/search", protect, searchUsers);
router.delete("/delete", protect, deleteAccount); // ✅ new

module.exports = router;