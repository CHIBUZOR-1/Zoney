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


const ChatSidebar = () => {
  const user = useSelector(state=> state?.user);
  const {socket} = useAuth();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=> {
    if(socket) {
      socket.emit("sidebar", user?.userId)
      socket.on("convoUser", (data)=>{
        const convUserData = data.map((convUser, i)=> {
          if(convUser?.sender?._id === convUser?.receiver?._id) {
            return{
              ...convUser,
              userDetails : convUser?.sender
            }
          } else if(convUser?.receiver?._id !== user?.userId) {
            return{
              ...convUser,
              userDetails : convUser.receiver
            }
          } else {
            return{
              ...convUser,
              userDetails : convUser.sender
            }
          }
          
        })
        setUsers(convUserData)
      })
    }
  }, [socket, user])
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='w-full bg-white h-full'>
      <div className='flex flex-col items-center p-2'>
        <div className='flex w-full justify-between items-center p-2'>
          <h2 className='font-semibold text-[19px]'>Chats</h2>
          <div className='flex items-center space-x-3'>
            <IoMdAdd className='text-[19px]'/>
            <IoSettingsSharp className='text-[19px]' />
          </div>
        </div>
        <div className='p-2 w-full'>
          <div className='w-full flex border px-1 rounded-sm border-slate-400 justify-center items-center'>
              <input type="text" onClick={showModal} className='outline-none p-2  w-full' placeholder='Search or start new chat' />
              <CiSearch className='text-[19px] cursor-pointer  font-semibold' />
          </div>
        </div>
        
      </div>
      <div className='overflow-x-hidden h-[calc(100vh-65px)] overflow-y-auto scrollbar'>
        {
          users.length === 0 && (
            <div>
              <div className='flex justify-center items-center'>
                <FaArrowUp size={30} className='text-slate-500' />
              </div>
              <p className='text-lg text-center text-slate-400'>Explore users to start a conversation</p>
            </div>
          )
        }
        {
          users.map((conv, i)=> {
            return(
              <NavLink to={`/messages/${conv?.userDetails?._id}`} key={conv?._id} className='flex items-center px-2 rounded cursor-pointer hover:bg-slate-100 py-3 border-transparent hover:border-green-300 gap-2 border'>
                <div>
                  <Avatarz image={conv?.userDetails?.profilePic} height={40} width={40} name={(conv?.userDetails?.firstname + " " + conv?.userDetails?.lastname).toUpperCase() || ""}/>
                </div>
                <div>
                  <h3 className='text-ellipsis font-semibold text-base line-clamp-1'>{(conv?.userDetails?.firstname + " " + conv?.userDetails?.lastname).toUpperCase() || ""}</h3>
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
                    <p className='text-sm text-ellipsis line-clamp-1 text-slate-500'>{conv?.lastMsg.text}</p>
                  </div>
                  
                </div>
                <div className='ml-auto flex flex-col justify-between gap-1 items-center'>
                  <p className='text-xs'>{calculateTime(conv?.lastMsg.createdAt)}</p>
                  {
                    Boolean(conv?.unseenMsg) && (
                      <p className='text-xs w-6 flex justify-center items-center h-6 ml-auto p-1 bg-green-500 text-white rounded-full font-semibold'>{conv?.unseenMsg}</p>
                    )
                  }
                </div>
                
                
              </NavLink>
            )
          })
        }
      </div>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Searchchat onclose={()=>setIsModalOpen(false)}/>
      </Modal>
    </div>
  )
}

export default ChatSidebar