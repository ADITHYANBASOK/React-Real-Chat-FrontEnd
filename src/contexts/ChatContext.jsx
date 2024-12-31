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
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_ACTIVE_CHAT":
      return { ...state, activeChat: action.payload };
    case "SET_TYPING":
      return { ...state, typingUsers: [...state.typingUsers, action.payload] };
    case "STOP_TYPING":
      return {
        ...state,
        typingUsers: state.typingUsers.filter((id) => id !== action.payload),
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();
  const socket = io('http://localhost:3000', {
    auth: { token: localStorage.getItem('token') },
  });

  useEffect(() => {
    if (user) {
      socket.emit("setup", user);

      // Listen for new messages
      socket.on("message received", (message) => {
        if (message.chatId === state.activeChat?._id) {
          dispatch({ type: "ADD_MESSAGE", payload: message });
        }
      });

      // Typing event listeners
      socket.on("typing", (userId) => {
        dispatch({ type: "SET_TYPING", payload: userId });
      });

      socket.on("stop typing", (userId) => {
        dispatch({ type: "STOP_TYPING", payload: userId });
      });

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

      // Emit the message via Socket.IO
      socket.emit("new message", messageData);
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

