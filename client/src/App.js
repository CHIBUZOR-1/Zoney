import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import NotificationPage from './Pages/NotificationPage';
import PageNotFound from './Pages/PageNotFound';
import ChatPage from './Pages/ChatPage';
import ChatContainer from './Components/ChatContainer';
import PrivateRoute from './Client-Utils/PrivateRoute';
import { useEffect, useState } from 'react';
import Loading from './Components/Loading';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Friends from './Pages/Friends';
import ProfilePage from './Pages/ProfilePage';
import GroupChatContainer from './Components/GroupChatContainer';
import VideosFeeds from './Pages/VideosFeeds';
import ResetPassword from './Pages/ResetPassword';
import VerifyEmail from './Pages/VerifyEmail';
import RegistrationNote from './Pages/RegistrationNote';
import FullViewPost from './Components/FullViewPost';

function App() {
  const [isLoading, setIsLoading] = useState(true); 
  const isAuthenticated = useSelector(state => state.user.user?.id);
  useEffect(() => { 
    // Simulate a loading process (e.g., fetching data) 
    setTimeout(() => { 
      setIsLoading(false); 
    }, 3000); // Adjust the loading time as needed 
  }, []); 
  if (isLoading) { 
    return <Loading />; 
  }
  
  return (
    <>
      <ToastContainer className={`max-sm:flex max-sm:justify-center max-sm:text-sm`} />
     <Routes>
      <Route path='/' element={isAuthenticated? <Navigate to="/home" /> : <LoginPage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
      <Route path='*' element={<PageNotFound/>}/>
      <Route path="/home" element={<PrivateRoute element={HomePage} />} />
      <Route path="/friends" element={<PrivateRoute element={Friends} />} />
      <Route path="/videos" element={<PrivateRoute element={VideosFeeds} />} />
      <Route path='/new-user' element={<RegistrationNote/>}/>
      <Route path="/Profile/:id" element={<PrivateRoute element={ProfilePage} />} />
      <Route path='/reset-password/:token' element={<ResetPassword/>}/>
      <Route path='/verify-email/:token' element={<VerifyEmail/>}/>
      <Route path="/postz/:postId" element={<FullViewPost />} />
      <Route path="/notifications" element={<PrivateRoute element={NotificationPage} />} /> 
      <Route path="/messages" element={<PrivateRoute element={ChatPage} />}> 
        <Route path=":id" element={<ChatContainer />} /> 
        <Route path='group/:groupid' element={<GroupChatContainer/>} />
      </Route>
     </Routes>
    </>
  );
}

export default App;
