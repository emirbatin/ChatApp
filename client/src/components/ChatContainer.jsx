import React from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useChat } from "../contexts/ChatContext"; // Context'i import ediyoruz
import { Avatar, Spacer } from "@nextui-org/react";

const ChatContainer = () => {
  const { selectedUser } = useChat();

  console.log("Selected user in ChatContainer:", selectedUser);

  return (
    <div className="md:w-full flex flex-col">
      {!selectedUser ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-row px-4 py-2 mb-2 justify-start items-center text-start">
            <Avatar src={selectedUser.profilePic}/>
            <Spacer x={2} />
            <div className="flex flex-col">
            <span className="text-gray-900 font-bold">{selectedUser.name}</span>
            <div className="text-xs text-green-500">Online</div>
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default ChatContainer;

const NoChatSelected = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};