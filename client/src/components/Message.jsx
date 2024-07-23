import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, Avatar, Spacer } from "@nextui-org/react";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={scroll}
      className={`flex items-end mb-4 ${
        message?.senderId === authUser?._id ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex items-center  max-w-xs space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            alt="Profile"
            src={
              message?.senderId === authUser?._id
                ? authUser?.profilePhoto
                : selectedUser?.profilePhoto
            }
          />
        </div>
        <div
          className={`flex flex-row rounded-3xl content-center px-4 py-2 ${
            message?.senderId === authUser?._id
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <div className="flex flex-1">{message?.message}</div>
          <Spacer x={4} />
          <div className="flex flex-0">
            <time className="text-[10px] font-thin mt-3">
              {message?.time || "12:45"}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
