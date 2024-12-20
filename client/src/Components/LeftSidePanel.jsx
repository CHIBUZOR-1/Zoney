import React from 'react'
import { logout } from '../State/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { disconnectSession } from '../Client-Utils/SocketConnection';
import { FaUserFriends } from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";
import { IoMdVideocam } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoMdNotifications } from "react-icons/io";
import Avatarz from './Avatar';
import { SlLogout } from "react-icons/sl";


const LeftSidePanel = () => {
  const users = useSelector(state => state?.user);
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
    <div className='fixed h-full w-[25%] max-[831px]:hidden transform transition-transform duration-200 ease-in-out translate-x-0 left-0 py-2 z-50 sm:z-0'>
        <div className='p-1 flex  h-[92%] flex-col justify-between px-3 overflow-y-auto'>
          <div className='space-y-3'>
                <div className='flex space-x-2 items-center cursor-pointer'>
                    <Avatarz userId={users?.userId} height={40} width={40} name={(users?.firstname + " " + users?.lastname).toUpperCase() || ""}/>
                    <p className='font-semibold'>{(users?.firstname + " " + users?.lastname).toUpperCase() || ""}</p>
                </div>
                <div className='flex gap-3 hover:bg-slate-200 items-center cursor-pointer'>
                  <FaUserFriends className='text-green-500 text-[25px]' />
                  <p className='font-semibold text-slate-600 text-[17px]'>Friends</p>
                </div>
                <div className='flex gap-3 hover:bg-slate-200 items-center cursor-pointer'>
                  <IoTimerOutline className='text-green-500 text-[25px]' />
                  <p className='font-semibold text-slate-600 text-[17px]'>Memories</p>
                </div>
                <div className='flex hover:bg-slate-200 gap-3 items-center cursor-pointer'>
                  <IoMdVideocam className='text-green-500 text-[25px]' />
                  <p className='font-semibold text-slate-600 text-[17px]'>Videos</p>
                </div>
                <Link to={"/profile"} className='flex hover:bg-slate-200 gap-3 items-center cursor-pointer'>
                  <CgProfile className='text-green-500 text-[25px]' />
                  <p className='font-semibold text-slate-600 text-[17px]'>Profile</p>
                </Link>
                <div className='flex gap-3 items-center hover:bg-slate-200 cursor-pointer'>
                  <IoMdNotifications className='text-slate-600 text-[25px]' />
                  <p className='font-semibold text-slate-600 text-[17px]'>Notifications</p>
                </div>
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