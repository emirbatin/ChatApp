import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";
import { BASE_URL } from "../main";
import { Input, Button } from "@nextui-org/react";

const SendInput = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    if (!selectedUser?._id) return;
    
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/message/send/${selectedUser._id}`,
        { message: message.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const userId = String(selectedUser._id);
      dispatch(addMessage({ userId, message: res.data.newMessage }));
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
      <div className="w-full relative mb-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
        />
        <Button
          isIconOnly
          type="submit"
          className="bg-transparent absolute flex inset-y-0 end-0 items-center"
        >
          <IoSend />
        </Button>
      </div>
    </form>
  );
};

export default SendInput;
