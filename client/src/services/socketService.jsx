import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (userId) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const socketOptions = {
    query: { userId }
  };
  
  if (token) {
    socketOptions.query.token = token;
  }

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", socketOptions);
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket has not been initialized.");
  }
  return socket;
};

export const isSocketInitialized = () => !!socket;
