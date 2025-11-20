import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const userSocketMap = {}; // {userId->socketId}

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Yeni kullanıcı kaydını broadcast et
const broadcastNewUser = (user) => {
  io.emit("newUserRegistered", user);
};

io.on("connection", (socket) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return socket.disconnect(true);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    
    userSocketMap[userId] = socket.id;
    
    // Online kullanıcıları tüm bağlı clientlara gönder
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", (reason) => {
      console.log(`User ${userId} disconnected. Reason: ${reason}`);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("error", (error) => {
      console.error(`Socket error for user ${userId}:`, error);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    socket.disconnect(true);
  }
});

export { app, io, server, getReceiverSocketId, broadcastNewUser };
