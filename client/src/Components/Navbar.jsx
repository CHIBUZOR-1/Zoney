import React, { useState } from 'react'
import { assets } from './Assets/assets'
import { CiSearch } from "react-icons/ci";
import { TiHome } from "react-icons/ti";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineChatBubble } from "react-icons/md";
import { RiNotification4Fill } from "react-icons/ri";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatarz from './Avatar';
import { Dropdown, Switch } from 'antd';
import { CiLight } from "react-icons/ci";
import { SlLogout } from "react-icons/sl";
import axios from 'axios';
import { disconnectSession } from '../Client-Utils/SocketConnection';
import { toast } from 'react-toastify';
import { logout } from '../State/UserSlice';



const Navbar = () => {
  const user = useSelector(state => state?.user);
  const location = useLocation()
  const basePath = location.pathname === '/messages';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
  const handleMenuClick = (e) => {
    if (e.key === '3') {
      setOpen(false);
    }
  };
  const handleOpenChange = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen);
    }
  };
  const onChange=()=> {

  }
  const items = [
    {
      key: '1',
      label: <div className='flex gap-2 w-28 items-center'><CiLight className='text-[19px] font-semibold' /><Switch defaultChecked onChange={onChange} /></div>
    },
    {
      key: '1',
      label: <div className='w-28 flex gap-2 h-10 px-1 items-center bg-slate-600 border rounded'>
                      <SlLogout  className='text-white'/>
                      <button onClick={logOut} className='w-[50%] active:bg-orange-600 bg-red-500 rounded text-white font-semibold'>Logout</button>
              </div>
    }
  ];

  
  return (
    <div className='w-full fixed z-50 right-0 left-0 top-0 flex px-1 justify-between bg-white items-center h-14 shadow-md'>
      <div className='flex items-center w-full gap-3'>
        <img className='h-12 items-center flex justify-center rounded-full' src={assets.z} alt="logo" />
        <form className='border bg-slate-100 px-1 flex items-center rounded-lg h-9' >
          <CiSearch className='text-[19px] text-slate-400' />
          <input className='rounded-lg px-1 outline-none h-7 bg-slate-100' type="text" placeholder='search zoney' />
        </form>
        
      </div>
      <div className='w-full flex max-[831px]:hidden items-center justify-between'>
        <Link to={'/home'} className='bg-slate-100 hover:border-green-300 hover:border cursor-pointer h-11 w-11 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
          <TiHome />
        </Link>
        <div className='h-11 w-11 border cursor-pointer hover:border-green-300 hover:border rounded-full flex items-center justify-center'>
          <MdOutlineOndemandVideo />
        </div>
        <div className='h-11 w-11 hover:border-green-300 cursor-pointer border rounded-full flex items-center justify-center'>
          <GrGroup />
        </div>
      </div>
      <div className='flex items-center justify-end space-x-5 h-24 w-full'>
        <div className='bg-slate-100 h-11 hover:border-green-300 hover:border cursor-pointer w-11 font-semibold flex justify-center items-center px-2 rounded-full'>
          <MdMenuOpen className='text-[28px]' />
        </div>
        <Link to={'/messages'} className={`bg-slate-100 hover:border-green-300 hover:border cursor-pointer ${basePath && 'hidden'} h-11 w-11 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full`}>
          <MdOutlineChatBubble />
        </Link>
        <div className='bg-slate-100 cursor-pointer hover:border-green-300 hover:border h-11 w-11 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
          <RiNotification4Fill />
        </div>
        <Dropdown menu={{items, onClick: handleMenuClick,}} onOpenChange={handleOpenChange} placement='bottom' open={open} trigger={['click']}>
          <div className='flex relative cursor-pointer hover:animate-pulse items-center hover:border-green-700 hover:border rounded-full justify-center'>
            <Avatarz userId={user?.userId} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""}  height={40} width={40}/>
          </div>
        </Dropdown>
        
        
      </div>
    </div>
  )
}

export default Navbar