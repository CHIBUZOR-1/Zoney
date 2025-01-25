import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../Context/AppContext';
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import { CiMenuKebab } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { LiaImageSolid } from "react-icons/lia";
import { IoMdVideocam } from "react-icons/io";
import { FaRegFaceSmile } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { BsFillMicFill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import VoiceMessage from './VoiceMessage';
import { calculateTime } from '../Client-Utils/CalculateTime';
import { useTheme } from '../Context/ThemeContext';
import AudioRecorder from './AudioRecorder';



const ChatContainer = () => {
  const { socket } = useAuth();
  const { bgd } = useTheme();
  const user = useSelector(state=> state?.user?.user);
  const [openUploads, setOpenUploads] = useState(false);
  const [allMessages, setAllMessages] = useState([])
  const [details, setDetails] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    online: false,
    image: ""
  });
  const emojiRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  useEffect(()=> {
    function clickOutside(event) {
      if(emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', clickOutside);
    return ()=> {
      document.removeEventListener('mousedown', clickOutside)
    };
  }, [emojiRef])
  
  const [showRecording, setShowRecording] = useState(false);
  const lastMessage = useRef()
  useEffect(()=>{
    if(lastMessage.current) {
      lastMessage.current.scrollIntoView({behaviour: 'smooth', block : 'end'})
    }
  },[allMessages]);
  
  useEffect(()=>{
    if(lastMessage.current) {
      lastMessage.current.scrollIntoView({behaviour: 'smooth', block : 'end'})
    }
  },[]);
  const [messages, setMessages] = useState({
    text: "",
    image: "",
    video: "",
    voiceClip: ""
  })
  const params = useParams();
  useEffect(()=> {
    if(socket){
      socket.emit('chats', params.id)

      socket.emit("seen", params.id)
      
      socket.on('message-user', (data)=>{
        setDetails(data)
      })
      socket.on("message", (data)=> {
        setAllMessages(data)
      })
      setMessages({ text: "", image: "", video: "", voiceClip: "" });
    }
  }, [socket, params?.id, user, allMessages.length, setMessages])

  const handleUploads = ()=>{
    setOpenUploads(prev=> !prev)
  }

  const uploadImg = (e) => {
    const file = e.target.files[0]
    setMessages(prev => ({ ...prev, image: file }));
    setOpenUploads(false)
  }
  const clearImg = () => {
    setMessages(prev => ({ ...prev, image: "" }));
  }
  const uplaodVids = (e) => {
    const file = e.target.files[0]
    setMessages(prev => ({ ...prev, video: file })); 
    setOpenUploads(false);
  }

  const clearVid = () => {
    setMessages(prev => ({ ...prev, video: "" }));
  }

  const handleFileUpload = async(file, type) => { 
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
  };

  const handleEmojiClick = (emojiObj) => { 
    setMessages(prev => ({ ...prev, text: prev.text + emojiObj.emoji })); 
  };
  const sendMessage = async()=> {
    let imageUrl = "", videoUrl = "", voiceUrl = ""; 
    if (messages.image) { 
      imageUrl = await handleFileUpload(messages.image, 'image'); 
    } 
    if (messages.video) { 
      videoUrl = await handleFileUpload(messages.video, 'video'); 
    } 
    if (messages.voiceClip) { 
      voiceUrl = await handleFileUpload(messages.voiceClip, 'voiceClip'); 
    }
    if(messages.text || imageUrl || videoUrl || voiceUrl) {
      if(socket) {
        socket.emit('new message', {
          sender: user?.id,
          receiver: params?.id,
          text: messages.text,
          imageUrl,
          videoUrl,
          voiceUrl,
          sentBy: user?.id
        })
        setMessages({
          text: "",
          image: "",
          video: "",
          voiceClip: ""
        })
      }
    }
  }
  console.log(messages)
  const handleSend = async (e) => {
    e.preventDefault();
    setShowRecording(false);
    await sendMessage();
  };
  

  const handleStopRecording = useCallback((audioBlob) => { 
    setMessages(m => ({ ...m, voiceClip: audioBlob })); 
  }, []); 



  return (
    <div style={{backgroundImage: `url(${bgd})`}} className='w-full overflow-hidden bg-no-repeat bg-cover'>
      <header className='sticky top-0 dark:bg-facebookDark-200 h-14 bg-white flex items-center justify-between px-3'>
        <div className='flex items-center gap-3'>
          <Link to={'/messages'} className='sm:hidden dark:text-slate-200'><IoIosArrowBack /></Link>
          <Link to={`/profile/${details._id}`} className='flex items-center'>
            <Avatar width={40} userId={details._id} height={40} image={details.image} name={(details?.firstname + " " + details?.lastname).toUpperCase() || ""}/>
          </Link>
          <div>
            <h3 className='font-semibold max-sm:text-sm dark:text-slate-200 text-lg'>{(details?.firstname + " " + details?.lastname || "").toUpperCase()}</h3>
            <p className='text-sm'>{details?.online? <span className='text-green-500'>online</span> : <span className='text-slate-400'>offline</span>}</p>
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
                <div  key={i+1} className={` p-1 py-1 w-fit max-w-[300px] rounded ${user.id === convo.byUser? "ml-auto bg-green-300":"bg-white"}`}>
                  <div>
                    {
                      convo?.image && (
                        <div className='w-full max-sm:w-48 max-sm:h-52'>
                          <img src={`/${convo?.image}`} className='w-full h-full object-scale-down' alt="" />
                        </div>
                      )
                    }
                  </div>
                  <div>
                    {
                      convo?.video && (
                        <div className='w-full'>
                          <video controls src={`/${convo?.video}`} className='w-full h-full object-scale-down' alt="" />
                        </div>
                      )
                    }
                  </div>
                  <div> 
                    {
                      convo?.audio && <VoiceMessage userz={details} message={convo}/>
                    } 
                  </div>
                  <div className='flex gap-2 items-center'>
                    <p className='px-3 font-medium'>{convo.text}</p>
                    <p className='text-xs font-medium ml-auto w-fit'>{calculateTime(convo?.createdAt)}</p>
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
                <button onClick={handleUploads} className='flex justify-center w-10 h-10 items-center hover:text-white hover:bg-green-600 rounded-full'>
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
                        <input type="file" id='videos' onChange={uplaodVids} accept="video/*" hidden />
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
                        <button onClick={handleSend}> 
                          <IoMdSend className='w-6 cursor-pointer h-6' /> 
                        </button> 
                      )
                } 
                
              </div>
            </div>
          ) : (
            <AudioRecorder hide={()=>{setShowRecording(false); setMessages(prev => ({ ...prev, voiceClip: "" }))}} onSend={sendMessage} onStopRecording={handleStopRecording}/>
          )
        }
       
      </section>
      
    </div>
  )
}

export default ChatContainer