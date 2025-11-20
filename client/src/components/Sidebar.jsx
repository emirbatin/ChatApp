import React, { useState, useMemo } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
} from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice";
import { BASE_URL } from "../main";
import { Button, Input, Spacer } from "@nextui-org/react";
import { disconnectSocket } from "../services/socketService";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const { otherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Real-time filtering - otherUsers state'ini değiştirme, sadece görünümü filtrele
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return otherUsers;
    return otherUsers?.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase())
    ) || [];
  }, [search, otherUsers]);

  const logoutHandler = async () => {
    try {
      // Önce socket bağlantısını kes
      disconnectSocket();

      const res = await axios.get(`${BASE_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });

      // Tüm token saklama alanlarını temizleyin
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      
      // Cookie'yi temizlemek için sunucuya bir istek göndermek yeterli olur
      document.cookie = "token=; Max-Age=0; path=/; domain=" + window.location.hostname;

      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
      dispatch(setMessages(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUser(null));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="border-r-1 p-4 flex flex-col">
      <h1>ChatApp</h1>
      <Spacer y={4} />
      <div className="flex items-center gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered rounded-md"
          type="text"
          placeholder="Search..."
          startContent={<BiSearchAlt2 className="text-gray-400" />}
        />
        {search && (
          <Button 
            isIconOnly 
            type="button"
            onClick={() => setSearch("")}
            className="bg-zinc-700 text-white"
            size="sm"
          >
            <IoMdClose className="w-5 h-5" />
          </Button>
        )}
      </div>
      <Spacer y={4} />
      <div className="divider px-3"></div>
      <OtherUsers filteredUsers={filteredUsers} />
      <div className="mt-2">
        <Button onClick={logoutHandler} color="danger" variant="bordered">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
