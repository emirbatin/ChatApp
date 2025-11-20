import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: {}, // { userId: [messages] }
    lastMessages: {}, // { userId: lastMessage }
    unreadCount: {}, // { userId: count }
  },
  reducers: {
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      if (!state.messages) state.messages = {};
      if (!state.lastMessages) state.lastMessages = {};
      
      const userIdStr = String(userId);
      state.messages[userIdStr] = messages;
      if (messages && messages.length > 0) {
        state.lastMessages[userIdStr] = messages[messages.length - 1];
      }
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.messages) state.messages = {};
      if (!state.lastMessages) state.lastMessages = {};
      
      const userIdStr = String(userId);
      if (!state.messages[userIdStr]) {
        state.messages[userIdStr] = [];
      }
      state.messages[userIdStr].push(message);
      state.lastMessages[userIdStr] = message;
    },
    incrementUnread: (state, action) => {
      const { userId } = action.payload;
      if (!state.unreadCount) state.unreadCount = {};
      const userIdStr = String(userId);
      state.unreadCount[userIdStr] = (state.unreadCount[userIdStr] || 0) + 1;
    },
    clearUnread: (state, action) => {
      const { userId } = action.payload;
      if (!state.unreadCount) state.unreadCount = {};
      const userIdStr = String(userId);
      state.unreadCount[userIdStr] = 0;
    },
  },
});

export const { setMessages, addMessage, incrementUnread, clearUnread } = messageSlice.actions;
export default messageSlice.reducer;
