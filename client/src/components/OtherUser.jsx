import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { Card, CardHeader, Avatar, Spacer } from "@nextui-org/react";

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const isOnline = onlineUsers?.includes(user._id);
  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
  };
  return (
    <Card
      isPressable
      onClick={() => {
        console.log("User selected:", user);
        selectedUserHandler(user);
      }}
      className="w-[25em] rounded-none shadow-none"
    >
      <CardHeader className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className={`avatar ${isOnline ? "online" : ""}`}>
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={
                user?.profilePhoto || "https://nextui.org/avatars/avatar-1.png"
              }
            />
          </div>
          <div className="flex flex-col gap-1 text-start">
            <h4 className="text-sm font-semibold leading-none text-gray-600">
              {user?.fullName}
            </h4>
          </div>
        </div>
        {/* user is online? */}
        <div
          className={`text-4xl ${
            isOnline ? "text-green-500" : "text-gray-500"
          }`}
        >
          •
        </div>
      </CardHeader>
    </Card>
  );
};

export default OtherUser;
