import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import { useSelector, useDispatch } from "react-redux";
import { setSocketConnected, setSocketError } from "./redux/socketSlice";
import { setOnlineUsers, setAuthUser, setLoading } from "./redux/userSlice";
import {
  initializeSocket,
  isSocketInitialized,
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
]);

function App() {
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Kullanıcı durumunu yükleyin
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      axios
        .get(`${BASE_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          dispatch(setAuthUser(response.data));
        })
        .catch(() => {
          dispatch(setLoading(false)); // Kullanıcı oturumu geçersizse yükleme tamamlandı
        });
    } else {
      dispatch(setLoading(false)); // Token yoksa yükleme tamamlandı
    }
  }, [dispatch]);

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
