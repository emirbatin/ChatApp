import { useEffect } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, clearUnread } from '../redux/messageSlice';
import { BASE_URL } from '../main';

const useGetMessages = () => {
    const { selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser?._id) return;
            
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/v1/message/${selectedUser._id}`);
                const userId = String(selectedUser._id);
                dispatch(setMessages({ userId, messages: res.data || [] }));
                dispatch(clearUnread({ userId }));
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };
        
        fetchMessages();
    }, [selectedUser?._id, dispatch]);
}

export default useGetMessages;
