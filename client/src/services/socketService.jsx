import { io } from 'socket.io-client';
import { BASE_URL } from '../main';

let socket;

export const initializeSocket = (userId) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No token available for WebSocket connection.");
  }

  socket = io(BASE_URL, {
    query: { token, userId },
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
