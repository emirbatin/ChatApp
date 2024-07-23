import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = () => {
  useGetOtherUsers();
  const { otherUsers } = useSelector((store) => store.user);

  // Ensure otherUsers is always an array
  const otherUsersArray = Array.isArray(otherUsers) ? otherUsers : [];

  return (
    <div className="overflow-auto flex-1">
      {otherUsersArray.length > 0 ? (
        otherUsersArray.map((user) => (
          <OtherUser key={user._id} user={user} />
        ))
      ) : (
        <div>No users to display</div>
      )}
    </div>
  );
};

export default OtherUsers;
