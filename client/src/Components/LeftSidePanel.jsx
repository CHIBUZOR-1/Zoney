import React from 'react'
import { logout } from '../State/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { disconnectSession } from '../Client-Utils/SocketConnection';
import { FaUserFriends } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoMdNotifications } from "react-icons/io";
import Avatarz from './Avatar';
import { SlLogout } from "react-icons/sl";


const LeftSidePanel = () => {
  const users = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOut = async()=> {
    const {data} = await axios.get('/api/users/logout');
    if(data.success) {
      toast.success(data.message);
      disconnectSession();
      dispatch(logout());
      navigate('/')
    }
    if(!data.success) {
        toast.warn(data.message);
    }
    
  }

  return (
    <div className='fixed h-full w-[25%] max-[833px]:hidden transform transition-transform duration-200 ease-in-out translate-x-0 left-0 py-2 z-50 sm:z-0'>
        <div className='p-1 flex  h-[92%] flex-col justify-between px-3 overflow-y-auto'>
          <div className='space-y-3'>
                <div className='flex px-1 dark:hover:bg-slate-400 py-2 hover:bg-slate-300 rounded space-x-2 items-center cursor-pointer'>
                    <Avatarz id={users?.id} image={users?.profilePic} height={40} width={40} name={(users?.firstname + " " + users?.lastname).toUpperCase() || ""}/>
                    <p className='font-semibold dark:text-white'>{(users?.firstname + " " + users?.lastname).toUpperCase() || ""}</p>
                </div>
                <Link to={"/friends?view=my_friends"} className='flex gap-3 dark:hover:bg-slate-400 px-1 py-2 rounded hover:bg-slate-300 items-center cursor-pointer'>
                  <FaUserFriends className='text-green-600 text-[25px]' />
                  <p className='font-semibold dark:text-white text-slate-600 text-[17px]'>Friends</p>
                </Link>
                <Link to={'/videos'} className='flex px-1 py-2 rounded dark:hover:bg-slate-400 hover:bg-slate-300 gap-3 items-center cursor-pointer'>
                  <IoMdVideocam className='text-green-600 text-[25px]' />
                  <p className='font-semibold dark:text-white text-slate-600 text-[17px]'>Videos</p>
                </Link>
                <Link to={`/Profile/${users?.id}`} className='flex dark:hover:bg-slate-400 hover:bg-slate-300 gap-3 px-1 py-2 rounded items-center cursor-pointer'>
                  <CgProfile className='text-green-600 text-[25px]' />
                  <p className='font-semibold dark:text-white text-slate-600 text-[17px]'>Profile</p>
                </Link>
            </div>
            <div className='w-full flex gap-2 h-10 px-1 items-center bg-slate-600 border rounded'>
                <SlLogout  className='text-white'/>
                <button onClick={logOut} className='w-[50%] active:bg-orange-600 bg-red-500 rounded text-white font-semibold'>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default LeftSidePanel