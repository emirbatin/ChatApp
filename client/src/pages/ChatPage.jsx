import React, { useState } from 'react';
import Chat from '../components/Message';
import UsersSidebar from '../components/UsersSidebar';
import ChatContainer from '../components/ChatContainer';


const ChatPage = () => {
    return ( 
        <div className="flex justify-center items-center w-screen h-screen">
            <div className="flex flex-row w-full h-full p-10 shadow-lg">
                <div className="flex flex-2 p-2">
                    <UsersSidebar/>
                </div>
                <div className="flex flex-1 p-2">
                    <ChatContainer/>
                </div>
            </div>
        </div>
    );
}
 
export default ChatPage;
