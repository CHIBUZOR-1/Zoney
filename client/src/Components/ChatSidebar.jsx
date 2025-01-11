import React, { useEffect, useState } from 'react'
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
import { calculateTime } from '../Client-Utils/CalculateTime';
import SearchGroupAdd from './SearchGroupAdd';


const ChatSidebar = () => {
  const chatz = useSelector(state => state?.user?.chatUsers);
  const groups = useSelector(state => state?.user?.groupChats);
  const user = useSelector(state => state.user.user);
  console.log(chatz)
  const { socket } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [loader, setLoader]= useState(false)
  const [groupName, setGroupName] = useState(''); 
  const [memberIds, setMemberIds] = useState([]);
  const [added, setAdded] = useState([]);

  useEffect(() => { 
          socket.on('groupCreated', (group) => { 
            socket.emit('fetchGroupDialogues', user?.id);
          }); 
          return () => { socket.off('groupCreated'); 
              socket.off('groupUpdated'); 
          }; 
  }, [socket, user?.id]);

  
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

  console.log(memberIds)
  console.log(added)

  console.log(groups)
  const handleCreate = () => { 
    socket.emit('createGroup', { 
      name: groupName, 
      members: memberIds 
    }); 
    setGroupName(''); 
    setMemberIds([]); 
    setAdded([])
    setIsModalOpen(false); 
  };

  const addMember = (memberId) => { setMemberIds(prev => [...prev, memberId]); };
  const addedz = (added) => { setAdded(prev => [...prev, added]); };


  return (
    <div className='w-full dark:bg-facebookDark-200 bg-slate-50 h-full'>
      <div className='flex flex-col items-center p-2'>
        <div className='flex w-full justify-between items-center p-2'>
          <h2 className='font-semibold dark:text-slate-100 text-[19px]'>Chats</h2>
          <div className='flex items-center space-x-3'>
            <IoMdAdd onClick={showModal1} className='text-[19px] dark:text-slate-100'/>
            <IoSettingsSharp className='text-[19px] dark:text-slate-100' />
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
        {
          chatz?.length > 0 && (
            chatz.map((conv, i)=> {
              return(
                <NavLink to={`/messages/${conv?.userDetails?._id}`} key={conv?._id} className='flex items-center px-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 border-transparent hover:border-green-300 gap-2 border'>
                  <div>
                    <Avatarz image={conv?.userDetails?.profilePic} height={40} width={40} name={(conv?.userDetails?.firstname + " " + conv?.userDetails?.lastname).toUpperCase() || ""}/>
                  </div>
                  <div>
                    <h3 className='text-ellipsis dark:text-slate-100 font-semibold text-base line-clamp-1'>{(conv?.userDetails?.firstname + " " + conv?.userDetails?.lastname).toUpperCase() || ""}</h3>
                    <div>
                      <div className='flex items-center'>
                        {
                          conv.lastMsg.image && (
                            <div className='flex gap-1 text-slate-500 items-center'>
                              <span><FaImage/></span>
                              {!conv?.lastMsg.text && <span>Image</span>}
                            </div>
                            
                          )
                        }
                        {
                          conv.lastMsg.video && (
                            <div className='flex gap-1 text-slate-500 items-center'>
                              <span><FaVideo/></span>
                              {!conv?.lastMsg.text && <span>Video</span>}
                            </div>
                            
                          )
                        }
                        {
                          conv.lastMsg.audio && (
                            <div className='flex gap-1 text-slate-500 items-center'>
                              <span><FaMicrophone/></span>
                              {!conv?.lastMsg.text && <span>Audio</span>}
                            </div>
                            
                          )
                        }
                      </div>
                      <p className='text-sm dark:text-slate-400 text-ellipsis line-clamp-1 text-slate-500'>{conv?.lastMsg.text}</p>
                    </div>
                    
                  </div>
                  <div className='ml-auto flex flex-col justify-between gap-1 items-center'>
                    <p className='text-xs dark:text-slate-300'>{calculateTime(conv?.lastMsg.createdAt)}</p>
                    {
                      Boolean(conv?.unseenMsg) && (
                        <p className='text-xs w-6 flex justify-center items-center h-6 ml-auto p-1 bg-green-500 text-white rounded-full font-semibold'>{conv?.unseenMsg}</p>
                      )
                    }
                  </div>
                  
                  
                </NavLink>
              )
            })
          )
          
        }
        {
          chatz?.length === 0 && (
            <div>
              <div className='flex justify-center items-center'>
                <FaArrowUp size={30} className='text-slate-500' />
              </div>
              <p className='text-lg dark:text-slate-100 text-center text-slate-400'>Explore users to start a conversation</p>
            </div>
          )
        }
        <h2 className='text-xl dark:text-slate-200 font-semibold pl-3'>Groups</h2>
        {
          groups?.length > 0 ? ( 
            groups.map((group, i) => ( 
              <NavLink to={`/messages/group/${group?._id}`} key={group?._id} className='flex items-center px-2 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 border-transparent hover:border-green-300 gap-2 border'> 
                <div> 
                  <Avatarz image={group?.image} height={40} width={40} name={group?.name.toUpperCase()} /> 
                </div> 
                <div> 
                  <h3 className='text-ellipsis dark:text-slate-100 font-semibold text-base line-clamp-1'>{group?.name}</h3> 
                  <div> 
                    <p className='text-sm dark:text-slate-400 text-ellipsis line-clamp-1 text-slate-500'>{group?.lastMsg?.text}</p> 
                  </div> 
                </div> 
                <div className='ml-auto flex flex-col justify-between gap-1 items-center'> 
                  {Boolean(group?.unseenMsg) && ( 
                    <p className='text-xs w-6 flex justify-center items-center h-6 ml-auto p-1 bg-green-500 text-white rounded-full font-semibold'>{group?.unseenMsg}</p> 
                    )
                  } 
                </div> 
              </NavLink> 
            )) 
          ) : ( 
          <div> 
            <p className='text-sm dark:text-slate-400 text-center text-slate-500'>No groups available</p> 
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
            <input className='p-1 w-full rounded-md outline outline-green-500' type="text" name="groupName" placeholder='Enter group name...' id="" />
            <input placeholder='search contacts' className='p-1 w-full rounded-md outline outline-green-500' type="text" />
            <SearchGroupAdd onAddMember={addMember} showAdded={addedz}/>
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