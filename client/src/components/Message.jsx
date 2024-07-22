import React from "react";
import { Avatar, Spacer } from "@nextui-org/react";
import { useChat } from "../contexts/ChatContext"; 


const Message = () => {
  const { selectedUser } = useChat();
  // Static values for demonstration
  const fromMe = true; // Change to false to simulate a message from someone else
  const formattedTime = "10:30 AM";
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const messageText = "Hello, this is a static message!";
  const shouldShake = false; // Change to true to simulate a shaking message

  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const shakeClass = shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="flex flex-row items-start mb-2">
        <Avatar src={selectedUser.profilePic} />
        <Spacer x={4} />
        <div
          className={`flex flex-row text-white ${bubbleBgColor} ${shakeClass} rounded-3xl content-center px-4 py-2`}
        >
          <div className="flex flex-1">{messageText}</div>
          <Spacer x={2} />
          <div className="flex flex-0">
            <div className="text-xs text-gray-200 mt-3">{formattedTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;