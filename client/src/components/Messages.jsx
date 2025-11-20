import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../hooks/useGetMessages";
import { useSelector } from "react-redux";

const Messages = () => {
  useGetMessages();
  const messagesEndRef = useRef(null);
  const { messages } = useSelector((store) => store.message);
  const { selectedUser } = useSelector((store) => store.user);

  const userId = selectedUser?._id ? String(selectedUser._id) : null;
  const messageArray = userId && messages[userId] ? messages[userId] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageArray]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {messageArray.length > 0 ? (
        <>
          {messageArray.map((message) => (
            <Message key={message._id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet. Start the conversation!
        </div>
      )}
    </div>
  );
};

export default Messages;
