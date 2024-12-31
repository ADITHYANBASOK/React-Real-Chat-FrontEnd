# Real-Time Chat Application

This is a real-time chat application built using React, Node.js, Socket.IO, and MongoDB. The app allows users to log in, register, and chat with each other in real-time. It includes features such as direct messaging, user presence (online/offline), and a responsive UI.

## Features

- **Authentication:** Users can sign up, log in, and access their dashboard.
- **Real-time Messaging:** Chat with other users in real-time using WebSockets (via Socket.IO).
- **User Presence:** Displays online/offline status for users.
- **Search Users:** Ability to search for users to start direct messages.
- **Responsive Design:** Built with Tailwind CSS for a responsive layout.
- **Private Route:** Protect certain pages (e.g., dashboard and settings) with authentication.

## Technologies Used

- **Frontend:**
  - React
  - React Router DOM
  - Tailwind CSS
  - Axios
  - React Hot Toast (for notifications)
  - Headless UI (for modal)
  - Heroicons (for icons)

- **Backend:**
  - Node.js
  - Express.js
  - Socket.IO (for real-time communication)
  - MongoDB
  - JWT Authentication

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/real-time-chat-app.git
cd react-real-chat-frontend
