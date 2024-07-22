import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useChat } from './ChatContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { selectedUser } = useChat();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      query: { userId: 'userIdFromAuth' }, // Giriş yapan kullanıcı ID'sini buraya eklemelisiniz
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && selectedUser) {
      socket.emit('join', selectedUser.id);
    }
  }, [socket, selectedUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
