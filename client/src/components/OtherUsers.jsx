import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";

const OtherUsers = ({ filteredUsers }) => {
  useGetOtherUsers();

  // filteredUsers prop'undan kullan, yoksa boş array
  const otherUsersArray = Array.isArray(filteredUsers) ? filteredUsers : [];

  return (
    <div className="overflow-auto flex-1">
      {otherUsersArray.length > 0 ? (
        otherUsersArray.map((user) => (
          <OtherUser key={user._id} user={user} />
        ))
      ) : (
        <div className="text-center text-gray-500 mt-4">No users found</div>
      )}
    </div>
  );
};

export default OtherUsers;
