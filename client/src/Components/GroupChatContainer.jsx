import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../Context/AppContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CiMenuKebab } from 'react-icons/ci';
import Avatarz from './Avatar';
import { IoIosArrowBack, IoMdAdd, IoMdSend, IoMdVideocam } from 'react-icons/io';
import { calculateTime, formatNumber } from '../Client-Utils/CalculateTime';
import { MdModeEdit, MdOutlineClose } from 'react-icons/md';
import { BsFillMicFill } from 'react-icons/bs';
import { FaRegFaceSmile } from 'react-icons/fa6';
import { LiaImageSolid } from 'react-icons/lia';
import EmojiPicker from 'emoji-picker-react';
import { Modal } from 'antd';
import { useTheme } from '../Context/ThemeContext';
import GroupVoiceMessage from './GroupVoiceMessage';
import AudioRecorder from './AudioRecorder';

const GroupChatContainer = () => {
    const { socket } = useAuth(); 
    const { bgd } = useTheme();
    const user = useSelector(state => state?.user?.user); 
    const [openUploads, setOpenUploads] = useState(false); 
    const [allMessages, setAllMessages] = useState([]); 
    const [grpImg, setGrpImg] = useState(null)
    const [modalOpen, setModalOpen] = useState(false);
    const params= useParams();
    const [newGroupName, setNewGroupName] = useState('')
    const [mod, setMod] = useState(false);
    const groupimgRef = useRef(null)
    const [noti, setNoti] = useState('')
    const [messages, setMessages] = useState({ 
        text: "", 
        image: "", 
        video: "", 
        voiceClip: "" 
    });

    const [groupDetails, setGroupDetails] = useState({ 
        _id: "", 
        name: "", 
        members: [], 
        unseenMsg: 0, 
        lastMsg: {} 
    });
    const emojiRef = useRef(null); 
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    useEffect(() => { 
        function clickOutside(event) { 
            if (emojiRef.current && !emojiRef.current.contains(event.target)) { 
                setShowEmojiPicker(false); 
            } 
        } 
        document.addEventListener('mousedown', clickOutside); 
        return () => { 
            document.removeEventListener('mousedown', clickOutside); 
        }; 
    }, [emojiRef]);
    const [showRecording, setShowRecording] = useState(false); 
    const lastMessage = useRef(); 
    useEffect(() => { 
        if (lastMessage.current) { 
            lastMessage.current.scrollIntoView({ behaviour: 'smooth', block: 'end' }); 
        } 
    }, [allMessages]);
    useEffect(() => { 
        if (lastMessage.current) { 
            lastMessage.current.scrollIntoView({ behaviour: 'smooth', block: 'end' }); 
        } 
    }, []);
    useEffect(() => { 
        if (socket) { 
            socket.emit('fetchGroupDetails', params.groupid); 
            //socket.emit('fetchGroupDialogues', params.groupid);
            socket.emit("markGroupMessageAsSeen", { groupId: params.groupid, userId: user?.id }); 
            socket.on('groupAllMessages', (messages) => {
                setAllMessages(messages);
            });
            socket.on('groupDetails', (data) => { 
                setGroupDetails(data); 
                setNewGroupName(data.name)
            }); 
            setMessages({
              text: "", 
              image: "", 
              video: "", 
              voiceClip: "" 
            })
        } 
    }, [socket, params?.groupid, allMessages.length, setMessages]);
    const handleUploadz = () => { 
        setOpenUploads(prev => !prev); 
    }; 
    const uploadImg = (e) => { 
        const file = e.target.files[0]; 
        setMessages(prev => ({ ...prev, image: file })); 
        setOpenUploads(false); 
    };

    const uploadImgz = (e) => {
      setGrpImg(null)
      const file = e.target.files[0]
      setGrpImg(file)
    }

    const handleModal = ()=> {
      setModalOpen(prev => !prev)
    }
    const clearImg = () => { 
        setMessages(prev => ({ ...prev, image: "" })); 
    }; 
    const uploadVids = (e) => { 
        const file = e.target.files[0]; 
        setMessages(prev => ({ ...prev, video: file })); 
        setOpenUploads(false); 
    };
    const clearVid = () => { 
        setMessages(prev => ({ ...prev, video: "" })); 
    }; 
    const handleFileUpload = async (file) => { 
        const formData = new FormData(); 
        formData.append('file', file); 
        try { 
            const response = await axios.post('/upload', formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            }); 
            return response.data.filePath; 
        } catch (error) { 
            console.error('Error uploading file:', error); 
            return null; 
        }
    }
    const handleFileUpload1 = async (file) => { 
      const formData = new FormData(); 
      formData.append('file', file); 
      try { 
          const response = await axios.post('/grp-upload', formData, { 
              headers: { 'Content-Type': 'multipart/form-data' } 
          }); 
          return response.data; 
      } catch (error) { 
          console.error('Error uploading file:', error); 
          return null; 
      }
  }
    const submitGroupinfo = async(e) => { 
        e.preventDefault(); 
        let imageUrlz = null;
        let groupPublicId = null; 
        if(grpImg) { 
          const resultz = await handleFileUpload1(grpImg); 
          imageUrlz = resultz.filePath;
          groupPublicId = resultz.public_id;
        }
        if(imageUrlz || newGroupName) {
          if(socket) {
            socket.emit('updateGroupInfo', { 
              groupId: groupDetails?._id,
              name: newGroupName, 
              imageUrl : imageUrlz !== null? imageUrlz : groupDetails?.image,
              updatedBy: user?.firstname + " " + user?.lastname,
              groupPublicId
            }); 
            setGrpImg(null); 
            setNewGroupName('');
          }
        }
       
    };
    const handleEmojiClick = (emojiObj) => { 
        setMessages(prev => ({ ...prev, text: prev.text + emojiObj.emoji })); 
    };
    const sendMessagez = async (e) => {
        let imageUrl = "", 
        videoUrl = "", 
        voiceUrl = ""; 
        if (messages.image) { 
            imageUrl = await handleFileUpload(messages.image); 
        } 
        if (messages.video) { 
            videoUrl = await handleFileUpload(messages.video); 
        }
        if (messages.voiceClip) { 
            voiceUrl = await handleFileUpload(messages.voiceClip); 
        } 
        if (messages.text || imageUrl || videoUrl || voiceUrl) { 
            if (socket) { 
                socket.emit('groupMessage', { 
                    groupId: params.groupid, 
                    sender: user?.id, 
                    text: messages.text, 
                    imageUrl, 
                    videoUrl, 
                    voiceUrl 
                }); 
                setMessages({ 
                    text: "", 
                    image: "", 
                    video: "", 
                    voiceClip: "" 
                }); 
            } 
        }
    }
    const handleSendz = async (e) => {
      e.preventDefault();
      setShowRecording(false);
      await sendMessagez();
    };
    const showMod = () => {
      setMod(true);
    };
    const handleCancelMod = () => {
      setMod(false);
      setGrpImg(null)
    };

  
  
    const handleStopRecordingz = useCallback((audioBlob) => { 
        setMessages(m => ({ ...m, voiceClip: audioBlob })); 
    }, []);

  
  return (
    <>
      {
        modalOpen && (
          <div className='w-full items-center bg-slate-200 gap-1 flex-col flex overflow-hidden dark:bg-facebookDark-300 h-screen'>
            <div className='flex w-full py-2 px-1  gap-8'>
              <div className='flex relative w-full items-center justify-center'>
                <button onClick={handleModal} className='p-2 dark:hover:bg-slate-500 hover:bg-slate-800 hover:text-slate-200 absolute top-1 left-1 flex items-center justify-center w-8 h-8 font-semibold dark:text-slate-200 rounded-full border border-slate-300'>X</button>
                <div className='w-fit flex relative items-center justify-center'>
                  <Avatarz height={260} width={260} image={groupDetails?.image} name={groupDetails?.name}/>
                  <button onClick={showMod} className='absolute bottom-4 right-4 hover:bg-slate-600 active:bg-black p-2 bg-slate-400 text-slate-100 rounded-full'><MdModeEdit /></button>
                </div>
              </div>
            </div>
            <div className='w-full flex-col flex items-center p-1 justify-center'>
              <h2 className='font-semibold dark:text-slate-200 text-2xl'>{groupDetails.name}</h2>
              <h4 className='text-sm text-slate-500 font-semibold dark:text-slate-400'>Group {formatNumber(groupDetails?.members.length)} members</h4>
            </div>
            <div className='w-full flex flex-col p-1'>
              <h2 className='dark:text-slate-200 font-semibold text-xl'>Members</h2>
              <div className='w-full h-full overflow-y-auto scrollbar pt-1 space-y-1'>
                {
                  groupDetails?.members.map((mb, i)=> {
                    return(
                      <div key={i} className='flex w-full md:w-[35%] items-center rounded-md gap-2 p-2 border dark:border-slate-300 border-slate-300'>
                        <Avatarz id={mb?._id} height={40} width={40} name={mb?.firstname + "" + mb?.lastname} image={mb?.profileImg}/>
                        <p className='dark:text-slate-200 font-semibold'>{mb?.firstname + "" + mb?.lastname}</p>
                      </div>
                    )
                  })
                }

              </div>
            </div>
            <Modal open={mod} className='custom-modal' footer={null} onCancel={handleCancelMod}>
              <div className='w-full'>
                <h2 className='text-xl dark:text-slate-200 font-semibold'>Edit group details</h2>
                <div className='w-full gap-1 flex-col items-center justify-center flex'>
                  <Avatarz height={180} width={180} image={grpImg? URL.createObjectURL(grpImg):groupDetails?.image} name={groupDetails?.name}/>
                  <button onClick={()=> groupimgRef.current.click()}  className='rounded-md bg-green-500 dark:border-slate-400 font-semibold p-2 border border-slate-300'>Upload image</button>
                  <input onChange={uploadImgz} ref={groupimgRef} hidden accept='image/*' type="file" />
                  <div className='w-full flex items-center justify-center'>
                    <input value={newGroupName} onChange={(e)=> setNewGroupName(e.target.value)} className='p-2 w-full font-semibold bg-slate-300 rounded-md dark:bg-slate-500 dark:text-slate-100' type="text" placeholder='New group name..' />
                  </div>
                </div>
                <div className='w-full p-1 flex items-center justify-center'>
                  <button onClick={submitGroupinfo} className='w-[50%] p-2 rounded-md bg-green-500 text-slate-100 text-sm font-semibold'>Update</button>
                </div>
              </div>
            </Modal>

          </div>
        )
      }
      { 
        !modalOpen && (
          <div style={{backgroundImage: `url(${bgd})`}} className='w-full overflow-hidden bg-no-repeat bg-cover'>
            <header className='sticky top-0 dark:bg-facebookDark-200 h-14 bg-white flex items-center justify-between px-3'>
              <div className='flex items-center gap-3'>
                <Link to={'/messages'} className='sm:hidden dark:text-slate-200'><IoIosArrowBack /></Link>
                <div onClick={handleModal}  className='flex cursor-pointer items-center'>
                  <Avatarz width={40} userId={groupDetails._id} height={40} image={groupDetails.image} name={(groupDetails?.name).toUpperCase() || ""}/>
                </div>
                <div>
                  <h3 className='font-semibold max-sm:text-sm dark:text-slate-200 text-lg'>{(groupDetails?.name || "").toUpperCase()}</h3>
                  <p className='text-sm dark:text-slate-100 font-semibold'>{formatNumber(groupDetails.members.length)} <span className='text-slate-400'>members</span></p>
                </div>
              </div>
              <div className='cursor-pointer text-slate-800 '>
                <CiMenuKebab className='text-black dark:text-slate-100' />
              </div>
            </header>
            {/**show all messages */}
            <section className='h-[calc(100vh-164px)] overflow-x-hidden overflow-y-scroll relative bg-slate-200 bg-opacity-50 scrollbar'>
              <div ref={lastMessage} className='flex mx-1 flex-col gap-2 py-1'>
                {
                  allMessages.map((convo, i)=> {
                    return(
                      <div  key={i+1} className={` p-1 px-1 py-1 w-fit max-w-[300px] rounded ${user?.id === convo?.sender?._id ? "ml-auto bg-green-300":"bg-white"}`}>
                        <div>
                          <p className='text-xs font-semibold'>{convo?.sender?.firstname + " " + convo?.sender?.lastname}</p>
                          {
                            convo?.image && (
                              <div className='w-full max-sm:w-48 max-sm:h-52'>
                                <img src={convo?.image} className='w-full h-full max-sm:object-fill object-scale-down' alt="" />
                              </div>
                            )
                          }
                        </div>
                        <div>
                          {
                            convo?.video && (
                              <div className='w-full'>
                                <video controls src={convo?.video} className='w-full h-full object-scale-down' alt="" />
                              </div>
                            )
                          }
                        </div>
                        <div> 
                          {
                            convo?.audio && <GroupVoiceMessage  message={convo}/>
                          } 
                        </div>
                        <div className='flex gap-2 items-center'>
                            <p className='px-3 font-medium'>{convo.text}</p>
                            <p className='text-xs ml-auto font-medium w-fit'>{calculateTime(convo?.createdAt)}</p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              {
                messages.image && (
                  <div className='h-full z-10 sticky bottom-0 w-full bg-opacity-30 flex justify-center items-center'>
                    <div className='w-fit p-2 absolute top-0 left-0 text-white'><MdOutlineClose className='cursor-pointer hover:text-red-500' onClick={clearImg} /></div>
                    <div className='bg-white p-3'>
                      <img src={URL.createObjectURL(messages.image) || ''} className='h-full w-full aspect-square object-scale-down max-w-sm m-2' alt="" />
                    </div>
                  </div>
                )
              }
              {
                messages.video && (
                  <div className='h-full sticky bottom-0 w-full bg-opacity-30 flex justify-center items-center'>
                    <div className='w-fit p-2 absolute top-0 left-0 text-white'><MdOutlineClose onClick={clearVid} /></div>
                    <div className='bg-white p-3'>
                      <video controls autoPlay muted src={URL.createObjectURL(messages.video)} className='h-full w-full aspect-square object-scale-down max-w-sm m-2'/>
                    </div>
                  </div>
                )
              }
              {/**all messages here */}
            </section>
            <section className='h-14 flex gap-1 px-1 items-center dark:bg-facebookDark-300 bg-white'>
              {
                !showRecording ? (
                  <div className='h-14 flex dark:bg-facebookDark-300 pb-2 gap-1 px-1 items-center w-full bg-white'>
                    <div className='relative'>
                      <button onClick={handleUploadz} className='flex justify-center w-10 h-10 items-center hover:text-white hover:bg-green-600 rounded-full'>
                        <IoMdAdd className='dark:text-slate-100' />
                      </button>
                      {/**Uploads */}
                      {
                        openUploads && (
                          <div className='absolute bg-white dark:bg-facebookDark-300 rounded shadow w-32 bottom-12 p-2'>
                            <form>
                              <label htmlFor="images" className='flex items-center hover:bg-slate-200 cursor-pointer p-2 gap-3'>
                                <div className='text-green-500'><LiaImageSolid /></div>
                                <p className='dark:text-slate-200'>Image</p>
                              </label>
                              <label htmlFor="videos" className='flex hover:bg-slate-200 cursor-pointer items-center p-2 gap-3'>
                                <div className='text-purple-600'><IoMdVideocam /></div>
                                <p className='dark:text-slate-200'>Videos</p>
                              </label>
                              <input type="file" id='images' onChange={uploadImg} accept="image/*" hidden/>
                              <input type="file" id='videos' onChange={uploadVids} accept="video/*" hidden />
                            </form>
                          </div>
                        )
                      }
                      
                    </div>
                    <div className='flex justify-center relative w-10 h-10 items-center cursor-pointer text-slate-600'>
                      <FaRegFaceSmile className='w-5 h-5' onClick={() => setShowEmojiPicker(val => !val)} />
                      { showEmojiPicker && (
                          <div ref={emojiRef} className={`absolute w-11 max-sm:left-0 bottom-14`}> 
                            <EmojiPicker  skinTonesDisabled={false} height={300} searchDisabled={true} theme='dark' onEmojiClick={handleEmojiClick} /> 
                          </div>
                        )
                      }
                    </div>
                    <div className='w-full h-8'>
                      <input type="text" value={messages.text} onChange={({target}) => setMessages(m => ({ ...m, text: target.value }))} className='w-full h-full outline-lime-400 border rounded-full px-2 bg-slate-300' placeholder='Enter Message ' />
                    </div>
                    <div className='w-10 flex justify-center items-center text-green-500 h-10'> 
                      {!messages.text.length && !messages.image && !messages.video ? ( 
                            <div>
                              <button onClick={()=> setShowRecording(true)}>
                                <BsFillMicFill className='w-6 cursor-pointer h-6' />
                              </button>
                              
                            </div> 
                          ) : 
                            ( 
                              <button onClick={handleSendz}> 
                                <IoMdSend className='w-6 cursor-pointer h-6' /> 
                              </button> 
                            )
                      } 
                      
                    </div>
                  </div>
                ) : (
                  <AudioRecorder hide={()=>{setShowRecording(false); setMessages(prev => ({ ...prev, voiceClip: "" }))}} onSend={sendMessagez} onStopRecording={handleStopRecordingz}/>
                )
              }
            
            </section>
        </div>
        )
        
      }
    </>
  )
}

export default GroupChatContainer