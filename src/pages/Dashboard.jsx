import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(true);
  const { activeChat } = useChat();

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 ${showSidebar ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Chats</h1>
            <Link to="/settings" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
        <ChatList />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}