import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Spacer } from "@nextui-org/react";

const Message = React.memo(({ message }) => {
  const { authUser, selectedUser } = useSelector((store) => store.user);

  const formatTime = useMemo(() => {
    if (!message?.createdAt) return "";
    const date = new Date(message.createdAt);
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }, [message?.createdAt]);

  const isOwnMessage = useMemo(() => 
    message?.senderId === authUser?._id, 
    [message?.senderId, authUser?._id]
  );

  const profilePhoto = useMemo(() => 
    isOwnMessage ? authUser?.profilePhoto : selectedUser?.profilePhoto,
    [isOwnMessage, authUser?.profilePhoto, selectedUser?.profilePhoto]
  );

  return (
    <div
      className={`flex items-end mb-4 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex items-center  max-w-xs space-x-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            alt="Profile"
            src={profilePhoto}
          />
        </div>
        <div
          className={`flex flex-row rounded-3xl content-center px-4 py-2 ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <div className="flex flex-1">{message?.message}</div>
          <Spacer x={4} />
          <div className="flex flex-0">
            <time className="text-[10px] font-thin mt-3">
              {formatTime}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Message;
