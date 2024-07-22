import React from "react";
import { Card, CardHeader, Avatar, Spacer } from "@nextui-org/react";
import { useChat } from "../contexts/ChatContext";

function Users({ user }) {
  const { setSelectedUser } = useChat();

  let message = "selam ben adal";

  return (
    <div>
      <Card
        isPressable
        onClick={() => {
          console.log("User selected:", user);
          setSelectedUser(user);
        }}
        className="w-[25em] rounded-none shadow-none"
      >
        <CardHeader className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={user.profilePic || "https://nextui.org/avatars/avatar-1.png"}
            />
            <div className="flex flex-col gap-1 text-start">
              <h4 className="text-sm font-semibold leading-none text-gray-600">
                {user.name}
              </h4>
              <div className="flex flex-row">
                <p className="text-xs text-gray-800">{message}</p>
                <Spacer x={2} />
                <p className="text-xs text-gray-500">3 saat önce</p>
              </div>
            </div>
          </div>
          <div className="text-4xl text-green-500">•</div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default Users;