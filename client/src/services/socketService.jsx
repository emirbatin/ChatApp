import { io } from 'socket.io-client';
import { BASE_URL } from '../main';

let socket;

export const initializeSocket = (userId) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No token available for WebSocket connection.");
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(BASE_URL, {
    query: { token, userId },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
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

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners(); // Tüm event listener'ları temizle
    socket.disconnect(); // Socket bağlantısını kes
    socket = null; // Socket referansını temizle
  }
};
