import { useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { jwtDecode } from 'jwt-decode';

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const { activeChat, messages, sendMessage, dispatch } = useChat();
  const token = localStorage.getItem('token');

  const decodedToken = jwtDecode(token); // Decode the token
  console.log('Decoded Token:', decodedToken);
  
  const userId = decodedToken.userId; // Extract the userId
  console.log('User ID:', userId);

  // Fetch messages when the active chat changes
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          console.log("activeChat",activeChat)
          const response = await fetch(
            `http://localhost:3000/api/messages/${activeChat._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
  
          if (!response.ok) throw new Error('Failed to fetch messages');
  
          const data = await response.json();
          console.log("data",data)
          dispatch({ type: 'SET_MESSAGES', payload: data });
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
  
      fetchMessages();
    }
  }, [activeChat, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage({
        chatId: activeChat._id,
        content: message,
        token:token,
      });
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            {activeChat?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-medium">{activeChat?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeChat?.status ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender._id === userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender._id === userId
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
