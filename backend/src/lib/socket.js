import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

export const app = express();
export const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: [
      ENV.CLIENT_URL || "http://localhost:5173", "http://127.0.0.1:5173",
    ],
    credentials: true, methods: ["GET", "POST"],
  },
});

// Socket Auth Middleware
io.use(socketAuthMiddleware);


export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Important: userSocketMap BEFORE getReceiverSocketId
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.user?.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.user?.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io };
