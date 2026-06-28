const User = require("../models/User");
const Message = require("../models/Message");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @POST /api/auth/register
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/users — only users you have chatted with
const getAllUsers = async (req, res) => {
  try {
    const myId = req.user._id;

    // Find all messages where I am sender or receiver
    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }],
    }).select("sender receiver");

    // Collect unique user IDs I have chatted with
    const chattedUserIds = new Set();
    messages.forEach((msg) => {
      const otherId = msg.sender.toString() === myId.toString()
        ? msg.receiver.toString()
        : msg.sender.toString();
      chattedUserIds.add(otherId);
    });

    // Fetch those users
    const users = await User.find({
      _id: { $in: Array.from(chattedUserIds) },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/search?query=name — search all users by username
const searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    if (!query || query.trim() === "") {
      return res.json([]);
    }
    const users = await User.find({
      _id: { $ne: req.user._id },
      username: { $regex: query, $options: "i" }, // case-insensitive search
    }).select("-password").limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @DELETE /api/auth/delete
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all messages sent or received by this user
    await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("❌ deleteAccount error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getAllUsers, searchUsers ,deleteAccount};