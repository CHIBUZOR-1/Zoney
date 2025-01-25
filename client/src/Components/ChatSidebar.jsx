import React, { useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaArrowUp, FaImage, FaMicrophone } from "react-icons/fa";
import { Modal } from 'antd';
import Searchchat from './Searchchat';
import { useSelector } from 'react-redux';
import { useAuth } from '../Context/AppContext';
import Avatarz from './Avatar';
import { FaVideo } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { sortBy } from 'lodash';
import { calculateTime } from '../Client-Utils/CalculateTime';
import SearchGroupAdd from './SearchGroupAdd';


const ChatSidebar = () => {
  const chatz = useSelector(state => state?.user?.chatUsers);
  const groupz = useSelector(state => state?.user?.groupChats);
  const users = useSelector(state => state.user.user);
  const { socket } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [loader, setLoader]= useState(false)
  const [groupName, setGroupName] = useState(''); 
  const [memberIds, setMemberIds] = useState([]);
  const [added, setAdded] = useState([]);

  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleCancel1 = () => {
    setIsModalOpen1(false);
    setGroupName(''); 
    setMemberIds([]);
    setAdded([])
  };

  const handleCreate = () => { 
    const members = [users.id, ...memberIds];
    socket.emit('createGroup', { 
      name: groupName, 
      members 
    }); 
    setGroupName(''); 
    setMemberIds([]); 
    setAdded([])
    setIsModalOpen(false); 
  };


  const addMember = (memberDetails) => { 
    if (!memberIds.includes(memberDetails?._id)) { 
      setMemberIds(prev => [...prev, memberDetails._id]); 
      setAdded(prev => [...prev, memberDetails]); 
    } 
  }; 
  const removeMember = (memberId) => { 
    setMemberIds(prev => prev.filter(id => id !== memberId)); 
    setAdded(prev => prev.filter(member => member._id !== memberId)); 
  };
  const combinedChats = [...chatz, ...groupz]; const sortedChats = sortBy(combinedChats, chat => -new Date(chat?.lastMsg?.createdAt));


  return (
    <div className='w-full dark:bg-facebookDark-200 bg-slate-50 h-full'>
      <div className='flex flex-col items-center p-2'>
        <div className='flex w-full justify-between items-center p-2'>
          <h2 className='font-semibold dark:text-slate-100 text-[19px]'>Chats</h2>
          <div className='flex items-center space-x-3'>
            <div onClick={showModal1} className='flex items-center cursor-pointer p-1 rounded-full hover:border hover:border-green-500 justify-center hover:dark:bg-slate-300'>
              <IoMdAdd  className='text-[19px] dark:text-slate-100'/>
            </div>
          </div>
        </div>
        <div className='p-2 w-full'>
          <div className='w-full flex bg-white rounded-md border px-1 dark:bg-slate-800 dark:border-slate-200 border-slate-400 justify-center items-center'>
              <input type="text" onClick={showModal} className='outline-none p-1 dark:bg-slate-800 w-full' placeholder='Search or start new chat' />
              <CiSearch className='text-[19px] dark:text-slate-100 cursor-pointer  font-bold' />
          </div>
        </div>
        
      </div>
      <div className={`overflow-x-hidden h-[calc(100vh-65px)] ${loader? "flex flex-col gap-2": ""}  overflow-y-auto scrollbar`}>
        {sortedChats.length > 0 && sortedChats.map((conv, i) => {
          const isGroup = !!conv.name;
          return (
            <NavLink to={`/messages/${isGroup ? 'group/' + conv?._id : conv?.userDetails?._id}`} key={conv._id} className='flex items-center px-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 border-transparent hover:border-green-300 gap-2 border'>
              <div>
                <Avatarz image={isGroup ? conv?.image : conv?.userDetails?.profileImg} height={40} width={40} name={isGroup ? conv.name.toUpperCase() : (conv?.userDetails?.firstname + " " + conv?.userDetails?.lastname).toUpperCase()} />
              </div>
              <div>
                <h3 className='text-ellipsis dark:text-slate-100 font-semibold text-base line-clamp-1'>{isGroup ? conv.name : (conv?.userDetails?.firstname + " " + conv?.userDetails?.lastname).toUpperCase()}</h3>
                <div>
                  {conv?.lastMsg?.image && (
                      <div className='flex gap-1 text-slate-500 items-center'>
                        <span className='text-sm'><FaImage /></span>
                        {!conv?.lastMsg.text && <span className='text-sm'>Image</span>}
                      </div>
                  )}
                  {conv?.lastMsg?.video && (
                      <div className='flex gap-1 text-slate-500 items-center'>
                        <span className='text-sm'><FaVideo /></span>
                        {!conv?.lastMsg.text && <span className='text-sm'>Video</span>}
                      </div>
                  )}
                  {conv?.lastMsg?.audio && (
                      <div className='flex gap-1 text-slate-500 items-center'>
                        <span className='text-sm'><FaMicrophone /></span>
                        {!conv?.lastMsg.text && <span className='text-sm'>Audio</span>}
                      </div>
                  )}
                  <p className='text-sm dark:text-slate-400 text-ellipsis line-clamp-1 text-slate-500'>{conv?.lastMsg?.text}</p>
                </div>
              </div>
              <div className='ml-auto flex flex-col justify-between gap-1 items-center'>
                <p className={`${!conv?.lastMsg?.createdAt? 'hidden': 'block'} dark:text-slate-200 text-xs mt-auto`}>{calculateTime(conv?.lastMsg?.createdAt)}</p>
                {Boolean(conv?.unseenMsg) && (
                  <p className='text-xs w-4 flex justify-center items-center h-4 ml-auto p-1 bg-green-500 text-white rounded-full font-semibold'>{conv.unseenMsg}</p>
                )}
              </div>
            </NavLink>
          );
        })}
        {!sortedChats.length && (
          <div>
            <div className='flex justify-center items-center'>
              <FaArrowUp size={30} className='text-slate-500' />
            </div>
            <p className='text-lg dark:text-slate-100 text-center text-slate-400'>Explore users to start a conversation</p>
          </div>
        )}
      </div>
      <Modal open={isModalOpen} className='custom-modal' footer={null} onCancel={handleCancel}>
        <Searchchat onclose={()=>setIsModalOpen(false)}/>
      </Modal>
      <Modal open={isModalOpen1} className='custom-modal' footer={null} onCancel={handleCancel1}>
        <div className='w-full flex flex-col gap-1'>
          <h1 className='font-semibold text-xl dark:text-slate-200'>Create Group</h1>
          <div className='w-full flex flex-col gap-2'>
            <input onChange={(e)=> setGroupName(e.target.value)} value={groupName} className='p-1 w-full rounded-md outline outline-green-500' type="text" name="groupName" placeholder='Enter group name...' id="" />
            <div className={`w-full ${added.length > 0? "grid" : "hidden"} h-20 grid-cols-3 overflow-y-auto scrollbar`}>
              {
                added.map((a, i)=> {
                  return(
                    <div key={a?._id} className='w-full p-1 rounded-md bg-green-700 h-fit justify-between items-center flex gap-1'>
                      <p className='text-sm font-semibold text-slate-100'>{a?.firstname + " " + a?.lastname}</p>
                      <button onClick={()=> removeMember(a?._id)} className='p-1 font-semibold text-slate-100 text-sm'>x</button>
                    </div>
                  )
                })
              }
            </div>
            <SearchGroupAdd onAddMember={addMember}/>
          </div>
          <div className='flex items-center justify-center w-full'>
            <button className='p-1 rounded-md border bg-green-500 text-slate-100 font-semibold  w-[70%]' onClick={handleCreate}>Create Group</button>
          </div>
          
        </div>
      </Modal>
    </div>
  )
}

export default ChatSidebar