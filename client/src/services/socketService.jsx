import io from "socket.io-client";

let socket;

export const initializeSocket = (userId) => {
  socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
    query: { userId },
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket has not been initialized.");
  }
  return socket;
};

export const isSocketInitialized = () => !!socket;
