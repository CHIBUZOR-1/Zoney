// useSocket.js
import { useEffect } from 'react';
import { useAuth } from '../Context/AppContext';
import { useDispatch, useSelector } from 'react-redux';
import { setChatUsers, setGroupChats } from '../State/UserSlice';

const useSocket = () => {
  const { socket } = useAuth();
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.user);

  useEffect(() => {
    if (socket && user?.id) {
      socket.emit('sidebar', user?.id);

      socket.on('convoUser', handleConvoUser);
      socket.on('groupDialogues', handleGroupDialogues);
      socket.on('groupUpdated', handleGroupDialogues);

      // Clean up the event listener on component unmount
      return () => {
        socket.off('convoUser', handleConvoUser);
        socket.off('groupDialogues', handleGroupDialogues);
        socket.off('groupUpdated', handleGroupDialogues);
      };
    }
  }, [socket, user?.id]);
  const handleConvoUser = (data) => {
    const convUserData = data.map((convUser) => {
      if (convUser?.sender?._id === convUser?.receiver?._id) {
        return {
          ...convUser,
          userDetails: convUser?.sender
        };
      } else if (convUser?.receiver?._id !== user?.id) {
        return {
          ...convUser,
          userDetails: convUser.receiver
        };
      } else {
        return {
          ...convUser,
          userDetails: convUser.sender
        };
      }
    });
    dispatch(setChatUsers(convUserData));
  };
  const handleGroupDialogues = (data) => { 
    dispatch(setGroupChats(data)); // Ensure you have an action for this 
  };
};

export default useSocket;
