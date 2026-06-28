const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socketHandler = require("./socket/socketHandler");

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

// ✅ Allowed origins — fixed http, removed duplicate
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app", // update after frontend deploy
];

// ✅ Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

// ✅ Middleware — only once
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Health check
app.get("/", (req, res) => res.send("✅ MERN Chat API is running"));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});