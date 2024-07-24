import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken"; // JWT kütüphanesi

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {}; // {userId->socketId}

io.on("connection", (socket) => {
  const token = socket.handshake.query.token; // Token'ı query parametre olarak alıyoruz

  if (!token) {
    return socket.disconnect(true);
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return socket.disconnect(true);
    }

    const userId = decoded.userId;
    userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
});

export { app, io, server, getReceiverSocketId };

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
