import io from 'socket.io-client';

let socket;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SERVER_URL, {
      auth: { token },
      withCredentials: true,
    });
  }

  return socket;
};

export const disconnectSession = () => {
    if (socket) {
      socket.disconnect();
      socket = null; // Reset the socket variable
    }
  };

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;