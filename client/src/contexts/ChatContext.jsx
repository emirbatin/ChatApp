import React, { createContext, useState, useContext } from "react";

// Context oluşturma
const ChatContext = createContext();

// Hook oluşturma
export const useChat = () => useContext(ChatContext);

// Context sağlayıcı komponent
export const ChatProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <ChatContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </ChatContext.Provider>
  );
};
