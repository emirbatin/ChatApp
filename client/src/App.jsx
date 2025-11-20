import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import { useSelector, useDispatch } from "react-redux";
import { setSocketConnected, setSocketError } from "./redux/socketSlice";
import {
  setOnlineUsers,
  setAuthUser,
  setLoading,
  checkAuthStatus,
  addOtherUser,
} from "./redux/userSlice";
import {
  initializeSocket,
  isSocketInitialized,
  disconnectSocket,
} from "./services/socketService";
import { BASE_URL } from "./main";
import ErrorBoundary from "./ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

function App() {
  const { authUser, isLoading } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Check auth status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Initialize socket connection once when user is authenticated
  useEffect(() => {
    if (!isLoading && authUser && !isSocketInitialized()) {
      try {
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

        // Yeni kullanıcı kaydı event listener
        socket.on("newUserRegistered", (newUser) => {
          dispatch(addOtherUser(newUser));
        });

        // Browser kapatıldığında veya sayfa yenilendiğinde socket'i kapat
        const handleBeforeUnload = () => {
          disconnectSocket();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          socket.off("connect");
          socket.off("disconnect");
          socket.off("connect_error");
          socket.off("getOnlineUsers");
          socket.off("newUserRegistered");
          window.removeEventListener("beforeunload", handleBeforeUnload);
          socket.close();
        };
      } catch (error) {
        console.error("Socket initialization error:", error.message);
      }
    }
  }, [authUser, dispatch, isLoading]);

  return (
    <ErrorBoundary>
      <div className="p-4 h-screen flex items-center justify-center">
        <RouterProvider router={router} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
