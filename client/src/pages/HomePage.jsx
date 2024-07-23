import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MessageContainer from "../components/MessageContainer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { authUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="flex h-screen w-screen rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <div className="flex flex-0">
        <Sidebar />
      </div>
      <div className="flex flex-1">
        <MessageContainer />
      </div>
    </div>
  );
};

export default HomePage;
