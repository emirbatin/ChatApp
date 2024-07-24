import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { setSocketConnected, setSocketError, setOnlineUsers } from './redux/socketSlice';

const useWebSocket = () => {
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser) {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
        query: { token },
      });

      socket.on("connect", () => {
        dispatch(setSocketConnected(true));
      });

      socket.on("disconnect", () => {
        dispatch(setSocketConnected(false));
      });

      socket.on("connect_error", (error) => {
        dispatch(setSocketError(error.message));
      });

      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => socket.close();
    }
  }, [authUser, dispatch]);
};

export default useWebSocket;
