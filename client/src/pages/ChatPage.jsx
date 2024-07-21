import React, { useState } from 'react';


const ChatPage = () => {
    const [allUsersCounter, setAllUsersCounter] = useState(0);
    const [allUsers, setAllUsers] = useState("");
    const [selectedUser, setSelectedUser] = useState(false);
    const [selectedUserMessages, setSelectedUserMessages] = useState([]);
    const [message, setMessage] = useState("");

    return ( 
        <div className="flex justify-center items-center w-screen h-screen">
            <div className="flex flex-row w-full h-full p-20 shadow-lg">
                <div className="flex flex-1">
                    <h1>Users</h1>
                </div>
                <div className="flex flex-1">
                    <h1>Chat</h1>
                </div>
            </div>
        </div>
    );
}
 
export default ChatPage;
