import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setOnlineUser } from '../State/UserSlice';
import { setSocketId } from '../State/SocketSlice';
import { connectSocket, disconnectSocket } from '../Client-Utils/SocketConnection';

const AppContext = createContext();

const AppContextProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector(state=> state?.user)
  console.log(user)
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch()
  const token = Cookies.get('socket');

  useEffect(() => {
    if (!token) {
      console.error('No token found!');
      return;
    }

    const socketConnection = connectSocket(token);

    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection);
    });

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });

    setSocket(socketConnection);
    dispatch(setSocketId(socketConnection.id));

    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line
  }, [user?.userId]);


  return (
    <AppContext.Provider value={{socket, setSocket}}>
      {children}
    </AppContext.Provider>
  )
}

const useAuth = () => useContext(AppContext);
export { useAuth, AppContextProvider };