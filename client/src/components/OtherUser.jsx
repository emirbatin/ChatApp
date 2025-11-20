import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { Card, CardHeader, Avatar, Badge } from "@nextui-org/react";

const OtherUser = React.memo(({ user }) => {
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((store) => store.user);
  const { lastMessages = {}, unreadCount = {} } = useSelector((store) => store.message);
  
  // Memoize computed values
  const userId = useMemo(() => String(user._id), [user._id]);
  const isOnline = useMemo(() => onlineUsers.includes(userId), [onlineUsers, userId]);
  const lastMessage = useMemo(() => lastMessages[userId], [lastMessages, userId]);
  const unread = useMemo(() => unreadCount[userId] || 0, [unreadCount, userId]);
  
  const getMessagePreview = useMemo(() => {
    if (!lastMessage) return "No messages yet";
    const text = lastMessage.message;
    return text.length > 40 ? text.substring(0, 40) + "..." : text;
  }, [lastMessage]);

  const selectedUserHandler = useCallback(() => {
    dispatch(setSelectedUser(user));
  }, [dispatch, user]);

  return (
    <Card
      isPressable
      onClick={selectedUserHandler}
      className={`w-[25em] rounded-none shadow-none ${unread > 0 ? 'bg-blue-50' : ''}`}
    >
      <CardHeader className="flex justify-between items-center">
        <div className="flex gap-3 items-center flex-1">
          <div className={`avatar ${isOnline ? "online" : ""}`}>
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={user?.profilePhoto || "https://nextui.org/avatars/avatar-1.png"}
            />
          </div>
          <div className="flex flex-col gap-1 text-start flex-1">
            <h4 className="text-sm font-semibold leading-none text-gray-600">
              {user?.fullName}
            </h4>
            <p className={`text-xs ${unread > 0 ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
              {getMessagePreview}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <Badge content={unread} color="primary" size="sm">
              <div className="w-2 h-2" />
            </Badge>
          )}
          <div className={`text-4xl ${isOnline ? "text-green-500" : "text-gray-500"}`}>
            •
          </div>
        </div>
      </CardHeader>
    </Card>
  );
});

export default OtherUser;
