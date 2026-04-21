import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  autoConnect: false,
});

let hasConnected = false;

export const connectSocket = () => {
  if (!hasConnected) {
    socket.connect();
    hasConnected = true;
  }
  return socket;
};

export const getSocket = () => socket;
