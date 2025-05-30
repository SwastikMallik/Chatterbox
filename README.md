# Chatterbox Project

## Description
Chatterbox is a real-time chat application consisting of a React + Vite frontend and a Node.js Express backend with Socket.io for real-time communication.

## Frontend Overview
The frontend is built with React and Vite, providing a fast and modern user interface. It includes ESLint configuration for code quality and uses React components to manage chat interactions.

## Backend Overview
The backend is a Node.js application using Express to serve the API and Socket.io to handle real-time WebSocket connections. It listens on port 3000 by default and allows CORS requests from the frontend running on port 5173.

## Installation and Running Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on port 3000 by default.

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on port 5173 by default.

## Technologies Used
- Frontend:
  - React
  - Vite
  - ESLint
- Backend:
  - Node.js
  - Express
  - Socket.io
  - dotenv
  - cors

## License
This project is licensed under the ISC License.
