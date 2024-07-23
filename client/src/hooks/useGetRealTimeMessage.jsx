import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../redux/messageSlice";
import { getSocket, isSocketInitialized } from "../services/socketService";

const useGetRealTimeMessage = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSocketInitialized() && selectedUser) {
      const socket = getSocket();

      socket.on("newMessage", (newMessage) => {
        dispatch(addMessage({ userId: newMessage.senderId, message: newMessage }));
      });

      return () => socket.off("newMessage");
    }
  }, [dispatch, selectedUser]);
};

export default useGetRealTimeMessage;
