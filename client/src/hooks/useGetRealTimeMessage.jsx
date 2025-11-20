import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, incrementUnread } from "../redux/messageSlice";
import { getSocket, isSocketInitialized } from "../services/socketService";
import toast from "react-hot-toast";

const useGetRealTimeMessage = () => {
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const selectedUserRef = useRef(selectedUser);

  // selectedUser değiştiğinde ref'i güncelle
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (isSocketInitialized() && authUser) {
      const socket = getSocket();

      const handleNewMessage = (newMessage) => {
        // Mesajı ilgili kullanıcının listesine ekle
        dispatch(addMessage({ userId: newMessage.senderId, message: newMessage }));
        
        // Kendi mesajımızsa bildirim gösterme
        if (String(newMessage.senderId) === String(authUser._id)) {
          return;
        }
        
        // Seçili kullanıcıdan gelen mesajsa bildirim gösterme ve unread artırma
        if (selectedUserRef.current && String(selectedUserRef.current._id) === String(newMessage.senderId)) {
          return;
        }
        
        // Seçili kullanıcıdan mesaj gelmiyorsa unread artır ve bildirim göster
        dispatch(incrementUnread({ userId: newMessage.senderId }));
        
        // Toast bildirimi
        const messagePreview = newMessage.message.length > 50 
          ? newMessage.message.substring(0, 50) + '...' 
          : newMessage.message;
        
        toast((t) => (
          <div className="flex items-center gap-3">
            <img 
              src={newMessage.senderPhoto || "https://nextui.org/avatars/avatar-1.png"} 
              alt="sender" 
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{newMessage.senderName}</p>
              <p className="text-xs text-gray-600">{messagePreview}</p>
            </div>
          </div>
        ), {
          duration: 3000,
          position: 'top-right',
        });
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [dispatch, authUser?._id]); // selectedUser yok!
};

export default useGetRealTimeMessage;
