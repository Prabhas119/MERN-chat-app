const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authroutes = require("./routes/authroutes");
const messageroutes = require("./routes/messageroutes");
const sockethandler = require("./socket/sockethandler");

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

// ✅ Allowed origins — fixed http, removed duplicate
const allowedOrigins = [
  "http://localhost:5173",
  // update after frontend deploy
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
app.use("/api/auth", authroutes);
app.use("/api/messages", messageroutes);

// ✅ Health check
app.get("/", (req, res) => res.send("✅ MERN Chat API is running"));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
