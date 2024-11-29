import { createContext, useContext, useReducer, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext({});

const initialState = {
  messages: [],
  activeChat: null,
  onlineUsers: [],
  typingUsers: [],
  chats: [],
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload };
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    case 'SET_TYPING':
      return { ...state, typingUsers: [...state.typingUsers, action.payload] };
    case 'STOP_TYPING':
      return {
        ...state,
        typingUsers: state.typingUsers.filter((id) => id !== action.payload),
      };
    case 'CREATE_GROUP':
      return { ...state, chats: [...state.chats, action.payload] };
    case 'CREATE_DIRECT_CHAT':
      return {
        ...state,
        chats: [...state.chats, { ...action.payload, type: 'direct' }],
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();
  const socket = io('http://localhost:3000'); // Replace with your server URL

  useEffect(() => {
    if (user) {
      // Notify server of user login and join chat rooms
      socket.emit('login', user.id);

      // Handle receiving a new message
      socket.on('message', (message) => {
        if (message.chatId === state.activeChat?._id) {
          dispatch({ type: 'ADD_MESSAGE', payload: message });
        }
      });

      // Other events
      socket.on('typing', (userId) => {
        dispatch({ type: 'SET_TYPING', payload: userId });
      });

      socket.on('stop_typing', (userId) => {
        dispatch({ type: 'STOP_TYPING', payload: userId });
      });

      socket.on('online_users', (users) => {
        dispatch({ type: 'SET_ONLINE_USERS', payload: users });
      });

      // Cleanup on component unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [user, state.activeChat]);

  const sendMessage = async (messageData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      socket.emit('send_message', message); // Emit message to the room
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const value = {
    ...state,
    sendMessage,
    dispatch,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);

