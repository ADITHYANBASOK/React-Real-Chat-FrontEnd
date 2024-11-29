import { useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import CreateGroupModal from './CreateGroupModal';
import { MagnifyingGlassIcon, UserGroupIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import DirectMessageModal from './DirectMessageModal';
import axios from 'axios';

export default function ChatList() {
  const [search, setSearch] = useState('');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isDirectMessageOpen, setIsDirectMessageOpen] = useState(false);
  const [user, setUsers] = useState([{}]); // Start with an empty array

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from storage
        const response = await axios.get('http://localhost:3000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to request headers
          },
        });
        console.log('Full API Response:', response.data);
        const uniqueUsers = response.data.users?.filter((user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
        ) || [];
        console.log('Unique Users:', uniqueUsers);
        setUsers(uniqueUsers); // Update state with unique users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('Updated user state:', user);
  }, [user]);

  const { dispatch, activeChat, chats } = useChat();

  const handleChatSelect = (chat) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat });
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="overflow-y-auto h-[calc(100vh-4rem)] relative">
        {/* Search and Create Group */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="flex items-center space-x-2 w-full btn-primary"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>Create New Group</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                activeChat?.id === chat.id ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                    {chat.type === 'group' ? (
                      <UserGroupIcon className="h-6 w-6" />
                    ) : (
                      chat.name.charAt(0)
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{chat.name}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Direct Message Button */}
        <div className="absolute bottom-0 right-0 p-4 bg-white dark:bg-gray-800">
          <button
            onClick={() => setIsDirectMessageOpen(true)}
            className="w-full flex items-center justify-center space-x-2 btn-primary"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>+</span>
          </button>
        </div>
      </div>

      <CreateGroupModal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)} />
      <DirectMessageModal
        isOpen={isDirectMessageOpen}
        onClose={() => setIsDirectMessageOpen(false)}
        users={user}
      />
    </>
  );
}
