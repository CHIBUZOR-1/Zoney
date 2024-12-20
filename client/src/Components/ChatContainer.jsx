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
import { assets } from './Assets/assets';
import EmojiPicker from 'emoji-picker-react';
import VoiceRecorder from './VoiceRecorder';
import axios from 'axios';
import moment from 'moment'
import VoiceMessage from './VoiceMessage';
import { calculateTime } from '../Client-Utils/CalculateTime';



const ChatContainer = () => {
  const {socket} = useAuth();
  const user = useSelector(state=> state?.user);
  const [openUploads, setOpenUploads] = useState(false);
  const [allMessages, setAllMessages] = useState([])
  const [details, setDetails] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    online: false,
    image: ""
  });
  const emojiRef = useRef(null)
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
  },[allMessages])
  const [messages, setMessages] = useState({
    text: "",
    image: "",
    video: "",
    voiceClip: ""
  })
  console.log(messages)
  const params = useParams();
  useEffect(()=> {
    if(socket){
      socket.emit('chats', params.id)

      socket.emit("seen", params.id)
      
      socket.on('message-user', (data)=>{
        console.log('user', data)
        setDetails(data)
      })
      socket.on("message", (data)=> {
        console.log("message", data)
        setAllMessages(data)
      })
    }
  }, [socket, params?.id, user])

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
  const handleSend = async(e)=> {
    e.preventDefault();
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
          sender: user?.userId,
          receiver: params?.id,
          text: messages.text,
          imageUrl,
          videoUrl,
          voiceUrl,
          sentBy: user?.userId
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
  

  const handleStopRecording = useCallback((audioBlob) => { 
    //const audioUrl = URL.createObjectURL(audioBlob);
    setMessages(m => ({ ...m, voiceClip: audioBlob })); 
    //setShowRecording(false); // Hide the recorder once recording is done 
  }, []); 



  return (
    <div style={{backgroundImage: `url(${assets.chatbg1})`}}className=' bg-no-repeat bg-cover'>
      <header className='sticky top-0  h-14 bg-white flex items-center justify-between px-3'>
        <div className='flex items-center gap-3'>
          <Link to={'/messages'} className='sm:hidden'><IoIosArrowBack /></Link>
          <div className='flex items-center'>
            <Avatar width={40} userId={details._id} height={40} image={details.image} name={(details?.firstname + " " + details?.lastname).toUpperCase() || ""}/>
          </div>
          <div>
            <h3 className='font-semibold text-lg'>{(details?.firstname + " " + details?.lastname || "").toUpperCase()}</h3>
            <p className='text-sm'>{details?.online? <span className='text-green-500'>online</span> : <span className='text-slate-400'>offline</span>}</p>
          </div>
        </div>
        <div className='cursor-pointer text-slate-800 '>
          <CiMenuKebab className='text-black' />
        </div>
      </header>
      {/**show all messages */}
      <section className='h-[calc(100vh-164px)] overflow-x-hidden overflow-y-scroll relative bg-slate-200 bg-opacity-50 scrollbar'>
        <div ref={lastMessage} className='flex mx-1 flex-col gap-2 py-1'>
          {
            allMessages.map((convo, i)=> {
              return(
                <div  key={i+1} className={` p-1 py-1 w-fit max-w-[300px] rounded ${user.userId === convo.byUser? "ml-auto bg-green-300":"bg-white"}`}>
                  <div>
                    {
                      convo?.image && (
                        <div className='w-full'>
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
                      convo?.audio && <VoiceMessage message={convo}/>
                    } 
                  </div>
                  
                  <p className='px-3'>{convo.text}</p>
                  <p className='text-xs ml-auto w-fit'>{calculateTime(convo?.createdAt)}</p>
                </div>
              )
            })
          }
        </div>
        {
          messages.image && (
            <div className='h-full w-full bg-opacity-30 flex justify-center items-center'>
              <div className='w-fit p-2 absolute top-0 left-0 text-white'><MdOutlineClose className='cursor-pointer hover:text-red-500' onClick={clearImg} /></div>
              <div className='bg-white p-3'>
                <img src={URL.createObjectURL(messages.image)} className='h-full w-full aspect-square object-scale-down max-w-sm m-2' alt="" />
              </div>
            </div>
          )
        }
        {
          messages.video && (
            <div className='h-full w-full bg-opacity-30 flex justify-center items-center'>
              <div className='w-fit p-2 absolute top-0 left-0 text-white'><MdOutlineClose onClick={clearVid} /></div>
              <div className='bg-white p-3'>
                <video controls autoPlay muted src={URL.createObjectURL(messages.video)} className='h-full w-full aspect-square object-scale-down max-w-sm m-2'/>
              </div>
            </div>
          )
        }
        {/**all messages here */}
      </section>
      <section className='h-14 flex gap-1 px-1 items-center bg-white'>
        {
          !showRecording ? (
            <div className='h-14 flex gap-1 px-1 items-center w-full bg-white'>
               <div className='relative'>
                <button onClick={handleUploads} className='flex justify-center w-10 h-10 items-center hover:text-white hover:bg-green-600 rounded-full'>
                  <IoMdAdd />
                </button>
                {/**Uploads */}
                {
                  openUploads && (
                    <div className='absolute bg-white rounded shadow w-32 bottom-12 p-2'>
                      <form>
                        <label htmlFor="images" className='flex items-center hover:bg-slate-200 cursor-pointer p-2 gap-3'>
                          <div className='text-green-500'><LiaImageSolid /></div>
                          <p>Image</p>
                        </label>
                        <label htmlFor="videos" className='flex hover:bg-slate-200 cursor-pointer items-center p-2 gap-3'>
                          <div className='text-purple-600'><IoMdVideocam /></div>
                          <p>Videos</p>
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
                {showEmojiPicker && (
                  <div ref={emojiRef} className='absolute bottom-14'> 
                    <EmojiPicker skinTonesDisabled={false} theme='dark' onEmojiClick={handleEmojiClick} /> 
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
            <VoiceRecorder hide={setShowRecording} onSend={handleSend} onStopRecording={handleStopRecording}/>
          )
        }
       
      </section>
      
    </div>
  )
}

export default ChatContainer