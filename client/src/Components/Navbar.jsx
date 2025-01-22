import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { MdDarkMode } from "react-icons/md";
import Avatarz from './Avatar';
import { Badge, Dropdown, Switch } from 'antd';
import { CiLight } from "react-icons/ci";
import { SlLogout } from "react-icons/sl";
import axios from 'axios';
import { IoMdArrowBack } from 'react-icons/io';
import { disconnectSession } from '../Client-Utils/SocketConnection';
import { toast } from 'react-toastify';
import { logout } from '../State/UserSlice';
import { useTheme } from '../Context/ThemeContext';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import ReactLoading from 'react-loading'
import { useAuth } from '../Context/AppContext';
import NotificationDropdown from './NotificationDropdown';
import MenuList from './MenuList';




const Navbar = () => {
  const user = useSelector(state => state?.user?.user);
  const location = useLocation()
  const basePath = location.pathname === '/messages';
  const [isFocused, setIsFocused] = useState(false);
  const { theme, toggleTheme } = useTheme(); 
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [phrase, setPhrase] = useState("")
  const [search, setSearch] = useState([])
  const { socket } = useAuth();  // Assuming you use a context for socket
  const [notificationz, setNotifications] = useState([]);
  const [unreadCountz, setUnreadCount] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisible1, setDropdownVisible1] = useState(false);
  const dropdownRef = useRef(null); 
  const dropdownRef1 = useRef(null); 
  const dropdownRef2 = useRef(null); 
  const iconRef = useRef(null);
  const iconRef1 = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(()=> {
      handleSearch()
        
  }, [phrase]);

  useEffect(()=> {
    getNotifications()
    if (socket) { 
      socket.on('newNotification', (notification) => { 
        setNotifications((prevNotifications) => [notification, ...prevNotifications]); 
        setUnreadCount((prevCount) => prevCount + 1); 
      }); 
    }
    return () => { 
      if (socket) { 
        socket.off('newNotification'); 
      } 
    };
      
}, [socket]);

useEffect(() => {
        if (isFocused && searchInputRef.current) {
            searchInputRef.current.focus();
        }
}, [isFocused]);

  const getNotifications = async() => {
    setLoading1(true)
    const {data}= await axios.get('/api/notifications/all-notifications');
    if(data.success) {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount)
      setLoading1(false)
    }
  }

  const markAllAsRead = () => {
    setUnreadCount(0);
    axios.post('/api/notifications/markAllAsRead');
  };

  const handleClickOutside = (event) => { 
    if ( dropdownRef.current && !dropdownRef.current.contains(event.target) && iconRef.current && !iconRef.current.contains(event.target) ) { 
      setDropdownVisible(false); 
    } 
  };

  const handleClickOutside1 = (event) => { 
    if ( dropdownRef1.current && !dropdownRef1.current.contains(event.target) && iconRef1.current && !iconRef1.current.contains(event.target)) { 
      setDropdownVisible1(false); 
    } 
  };

  const handleClickOutside2 = (event) => { 
    if ( dropdownRef2.current && !dropdownRef2.current.contains(event.target)) { 
      setIsFocused(false); 
      setPhrase("");
    } 
  };
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); 
    return () => { 
      document.removeEventListener("mousedown", handleClickOutside); 
    }; 
  }, []);  
  
  useEffect(() => { 
    document.addEventListener("mousedown", handleClickOutside1); 
    return () => { 
      document.removeEventListener("mousedown", handleClickOutside1); 
    }; 
  }, []); 

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside2); 
    return () => { 
      document.removeEventListener("mousedown", handleClickOutside2); 
    }; 
  }, []); 
    
  const handleSearch = async() => {
        try {
          setLoading(true)
          const {data} = await axios.post("/api/users/search", {phrase})
          setLoading(false)
          setSearch(data?.data)
        } catch (error) {
          toast.error(error?.data?.message)
        }
      }
  const toggleDropdown = (event) => { 
    event.stopPropagation();
    if (!dropdownVisible) { markAllAsRead(); }
    setDropdownVisible(!dropdownVisible); 
  };

  const toggleDropdown1 = (event) => { 
    event.stopPropagation();
    setDropdownVisible1(!dropdownVisible1); 
  };


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

  
  const items = [
    {
      key: '1',
      label: <div className='flex gap-2 w-28 items-center'>{theme === 'dark'? <MdDarkMode className='text-[19px] dark:text-slate-200 font-semibold'/> :
<CiLight className='text-[19px] font-semibold' />}<Switch checked={theme === 'dark'} onChange={toggleTheme} /></div>
    },
    {
      key: '2',
      label: <div className='w-28 flex gap-2 h-10 px-1 items-center bg-slate-600 border rounded'>
                      <SlLogout  className='text-white'/>
                      <button onClick={logOut} className='w-[70%] active:bg-orange-600 bg-red-500 rounded text-white font-semibold'>Logout</button>
              </div>
    }
  ];

  
  return (
    <div className='w-full fixed z-40 right-0 left-0 dark:bg-facebookDark-200 border-b border-b-facebookDark-400 top-0 flex px-1 justify-between bg-slate-50 items-center h-14 shadow-md'>
      <div className='flex relative items-center w-full gap-3'>
        <img className='h-12 w-12 items-center cursor-pointer flex justify-center rounded-full' onClick={()=> navigate('/home')} src={assets.z} alt="logo" />
        <form className='border w-auto max-md:hidden bg-slate-100 px-1 flex items-center max-sm:hidden rounded-lg h-9' >
          <CiSearch className='text-[19px] max-md:hidden max-sm:cursor-pointer text-slate-400' />
          <input onClick={() => setIsFocused(true)} onChange={(e) => setSearchTerm(e.target.value)} className='rounded-lg px-1 w-full max-md:hidden outline-none h-7 bg-slate-100' type="text" placeholder='search zoney' />
        </form>
        <CiSearch onClick={() => setIsFocused(true)} className='text-[19px] max-sm:text-2xl font-bold md:hidden dark:text-white max-sm:cursor-pointer text-slate-500' />
        {isFocused && (
                <div ref={dropdownRef2} className="absolute max-sm:w-screen z-50 flex flex-col gap-2 top-0 dark:bg-facebookDark-300 right-0 left-0 w-72 max-sm:h-screen bg-white shadow-lg rounded-lg p-2">
                  <div className='w-auto flex items-center gap-2'>
                    <button onClick={() => setIsFocused(false)} className="dark:text-gray-300 ml-2"> <IoMdArrowBack /> </button>
                    <input value={phrase} ref={searchInputRef} onChange={(e)=> setPhrase(e.target.value)}  className='rounded-lg px-1 outline-none h-7 bg-slate-100' type="text" placeholder='search zoney' />
                  </div>
                  <div className='flex flex-col w-full'>
                    <p className="text-gray-600 dark:text-white">Recent searches</p>
                    {
                      loading && (
                        <div className='flex justify-center items-center pt-2'>
                          <ReactLoading type="spin" color='black' height={30} width={30}/>
                        </div>
                                
                      )
                    }
                    {
                      !search.length && !loading && (
                        <p className='text-center text-lg text-slate-400'>No user found!</p>
                      )
                    }
                    {
                      !phrase && search.length > 0 && !loading && (
                        <div className='w-full mt-1 items-center flex justify-center'>
                          <p className='dark:text-slate-300 text-slate-500'>No recent searches</p>
                        </div>
                      )
                    }
                    {
                      search.length > 0 && phrase.length !== 0 && !loading && (
                        search.map((srch) => {
                          return(
                            <Link onClick={()=> setIsFocused(false)} to={`/profile/${srch?._id}`} key={srch?._id} className={`flex hover:bg-gray-500 w-full cursor-pointer items-center gap-3 p-2`}>
                              <div>
                                <Avatarz height={40} image={srch?.profileImg} width={40} srchId={srch?._id} name={(srch?.firstname + " " + srch?.lastname).toUpperCase()}/>
                              </div>
                              <div>
                                <div className='font-semibold dark:text-slate-200'>
                                  <p>{srch?.firstname + " " + srch?.lastname}</p>
                                </div>
                              </div>
                            </Link>
                          )
                        })
                      )
                    }
                  </div>
                </div>
        )}
        
      </div>
      <div className='w-full flex max-[831px]:hidden items-center justify-between'>
        <Link to={'/home'} className='bg-slate-100 hover:border-green-300 hover:border cursor-pointer h-10 w-10 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
          <TiHome />
        </Link>
        <Link to={'/videos'} className='h-10 w-10 border cursor-pointer hover:border-green-300 hover:border rounded-full flex items-center justify-center'>
          <MdOutlineOndemandVideo className='text-slate-500' />
        </Link>
        <Link to={"/friends?view=my_friends"} className='h-10 w-10 hover:border-green-300 cursor-pointer border rounded-full flex items-center justify-center'>
          <GrGroup className='dark:text-slate-300 text-slate-500' />
        </Link>
      </div>
      <div className='flex items-center max-sm:gap-2 justify-end gap-3 h-24 w-full'>
        <div  className='bg-slate-100 h-10 hidden max-[831px]:flex dark:bg-facebookDark-600 hover:border-green-300 hover:border cursor-pointer w-10 font-semibold justify-center items-center px-2 rounded-full'>
          <div ref={iconRef1} onClick={toggleDropdown1}>
            <MdMenuOpen className='text-[28px] text-slate-700 dark:text-slate-300' />
          </div>
          {dropdownVisible1 && <MenuList refy={dropdownRef1}/>}
        </div>
        
        <Link to={'/messages'} className={`bg-slate-100 hover:border-green-300 dark:bg-facebookDark-600 hover:border cursor-pointer ${basePath && 'hidden'} h-10 w-10 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full`}>
          <MdOutlineChatBubble className='dark:text-slate-300 text-slate-700' />
        </Link>
          <Badge ref={iconRef} count={unreadCountz} size='small'>
            <div onClick={toggleDropdown} className='dark:bg-facebookDark-600 cursor-pointer border hover:border-green-300 hover:border h-10 w-10 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
              <RiNotification4Fill  className='dark:text-slate-300'/>
            </div>
          </Badge>
          {dropdownVisible && <NotificationDropdown refy={dropdownRef} notifications={notificationz} load={loading1} setDropdownVisible={setDropdownVisible}/>}
        
        <Dropdown overlayClassName='custom-dropdown' menu={{items, onClick: handleMenuClick,}} onOpenChange={handleOpenChange} placement='bottom' open={open} trigger={['click']}>
          <div className='flex relative cursor-pointer items-center hover:border-green-700 hover:border rounded-full justify-center'>
            <Avatarz id={user?.id} image={user?.profilePic} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""}  height={40} width={40}/>
            <IoIosArrowDropdownCircle className='absolute hover:animate-pulse dark:text-white text-slate-400 -bottom-1' />
          </div>
        </Dropdown>
        
        
      </div>
    </div>
  )
}

export default Navbar