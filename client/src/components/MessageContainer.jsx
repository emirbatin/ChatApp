import React from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { Avatar } from "@nextui-org/react";

const MessageContainer = () => {
  const { selectedUser, authUser, onlineUsers } = useSelector(
    (store) => store.user
  );
  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <>
      {selectedUser !== null ? (
        <div className="md:min-w-full flex flex-col">
          <div className="flex gap-2 items-center px-4 py-4 mb-4 border-b-1">
            <div className={`avatar ${isOnline ? "online" : ""} mr-2`}>
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={
                  selectedUser?.profilePhoto ||
                  "https://nextui.org/avatars/avatar-1.png"
                }
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex">
                <p className="text-medium font-bold">
                  {selectedUser?.fullName}
                </p>
              </div>
              <div
                className={`text-xs ${
                  isOnline ? "text-green-500" : "text-gray-500"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>
          </div>
          <Messages />
          <SendInput />
        </div>
      ) : (
        <div className="md:min-w-[550px] flex flex-col justify-center items-center">
          <h1 className="text-4xl text-white font-bold">
            Hi, {authUser?.fullName}
          </h1>
          <h1 className="text-2xl text-white">Let's start conversation</h1>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
