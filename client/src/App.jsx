import React from "react";
import Signup from "./pages/SignupPage";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSocketConnected, setSocketError } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/userSlice";
import { initializeSocket, isSocketInitialized } from "./services/socketService";
import { BASE_URL } from "./main";
import ErrorBoundary from "./ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser && !isSocketInitialized()) {
      const socket = initializeSocket(authUser._id);

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

  return (
    <ErrorBoundary>
      <div className="p-4 h-screen flex items-center justify-center">
        <RouterProvider router={router} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
