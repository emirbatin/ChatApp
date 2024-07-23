import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: {}, // { userId: [messages] }
  },
  reducers: {
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      state.messages = { ...state.messages, [userId]: [...messages] }; // Immutable update
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;
      state.messages = {
        ...state.messages,
        [userId]: state.messages[userId]
          ? [...state.messages[userId], message]
          : [message],
      }; // Immutable update
    },
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
