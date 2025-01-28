import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'antd';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import {  IoMdThumbsUp } from "react-icons/io";
import { TfiComment } from "react-icons/tfi";
import { FaRegFaceSmile } from "react-icons/fa6";
import { MdSend } from 'react-icons/md';
import { useAuth } from '../Context/AppContext';
import { calculateTime, formatNumber } from '../Client-Utils/CalculateTime';
import Avatarz from './Avatar';

const FullViewPost = ({pst, close, onUpdate}) => {
    const { socket } = useAuth();
    const user = useSelector(state => state?.user?.user)
    const [newText, setText] = useState('')
    //const { id } = useParams();
    const emojiRef = useRef(null)
    const [selectPost, setSelectPost] = useState(null);
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
    }, [emojiRef]);

    const handleEmojiClick = (emojiObj) => { 
        setText(prev => prev + emojiObj.emoji ); 
    };
    const handleLikeUnlike = async () => {
        try {
          const {data} = await axios.post(`/api/posts/like/${pst._id}`);
          onUpdate(data.updatedPost)
          //setPst(data.updatedPost);
          console.log(data.updatedPost)
          if (socket && !pst.likes.includes(user.id) && pst?.user?._id !== user?.id) { 
            socket.emit('postLiked', { 
              from: user.id, 
              to: pst.user, 
              liked: true 
            }); 
          }
        } catch (error) { 
          console.error('Error liking/unliking post:', error); 
        } 
      };
      const handlePostClick = (pst) => { 
        setSelectPost(pst); 
    };

    const handleCloseModal = () => { 
        setSelectPost(null); 
    };
      const commentPost = async(e)=> {
        e.preventdefault();
        try {
          const {data} = await axios.post(`/api/posts/comment/${pst._id}`, {newText});
          onUpdate(data.post)
          //setPst(data.post);
          console.log(data.post)
          setText('')
          if (socket && pst.user?._id !== user.id) { 
            socket.emit('commentz', { 
              from: user?.id, 
              to: pst?.user?._id 
            }); 
          }
        } catch (error) {
          console.error('Error commenting on post:', error); 
        }
      }
      //const absoluteUrl = url.startsWith('http') ? url : `${process.env.REACT_APP_SERVER_URL}/${url}`;
      const downloadFile = async (url, filename) => {
        if (!url) {
            alert('File URL is missing.');
            return;
        }
    
        try {
            const response = await axios.get(url, {
                responseType: 'blob',
            });
    
            const blob = new Blob([response.data], { type: response.data.type });
            const link = document.createElement('a');
            const urlBlob = window.URL.createObjectURL(blob);
            link.href = urlBlob;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Could not download the file. Please try again later.');
        }
    };
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className='w-full relative overflow-hidden max-md:flex-col h-full bg-facebookDark-200 gap-2 flex'>
            <div className='md:w-[70%] max-md:h-[60%] max-md:w-full bg-facebookDark-200 h-full'>
                <div onClick={() => handlePostClick(pst)} className='w-full h-full relative p-1'>
                    <button onClick={close} className='absolute dark:bg-slate-500 dark:text-white flex items-center justify-center h-9 w-9 cursor-pointer p-2 rounded-full font-semibold bg-slate-100 z-20'>X</button>
                   {
                        pst?.image && (
                            <div className='w-full cursor-pointer relative h-full'>
                                <img src={pst?.image} className='h-full absolute max-sm:object-fill inset-0 w-full object-scale-down' alt="" />
                            </div>
                        )
                    }
                    {
                        pst?.video && (
                            <div className='w-full cursor-pointer h-[400px] relative'>
                              <video controls src={pst?.video} className='h-full w-full absolute inset-0 object-cover'/>
                            </div>
                          )
                    } 
                </div>
                
            </div>
            <div className='md:w-[30%] bg-slate-50 md:h-full max-md:h-[40%] m-0 max-md:w-full p-1 dark:bg-slate-600'>
                <div className='w-full h-full flex flex-col gap-1'>
                    <div className='flex gap-1'>
                      <Avatarz height={45} width={45} image={pst?.user?.profileImg} name={(pst?.user?.firstname + " " + pst?.user?.lastname).toUpperCase()}/>
                        <div className='flex flex-col items-center'>
                            <p className='font-semibold dark:text-slate-100'>{pst?.user?.firstname + " " + pst?.user?.lastname}</p>
                            <p className='text-xs font-semibold dark:text-slate-300'>{calculateTime(pst.createdAt)}</p>
                        </div>  
                    </div>
                    
                    <div className=' h-full'>
                        <div>
                            <p className='font-medium dark:text-slate-100'>{pst?.text}</p>
                        </div>
                        <div className='p-1 w-full flex justify-between text-xs'>
                            <p className='text-slate-700 dark:text-slate-200'>{formatNumber(pst?.likes?.length ? pst.likes.length : 0) + " likes"}</p>
                            <p className='text-slate-700 dark:text-slate-200'>{formatNumber(pst?.comments?.length? pst.comments.length : 0) + " comments"}</p>
                        </div>
                        <hr  className='w-full'/>
                        <div className='flex  justify-between w-full items-center p-1'>
                            <button onClick={handleLikeUnlike} className='flex justify-center hover:bg-slate-200 w-full rounded cursor-pointer px-2 py-1 items-center gap-1'>
                                <IoMdThumbsUp   className={`${pst?.likes?.includes(user?.id) ? 'text-red-500' : 'text-slate-500 dark:text-slate-200'} max-sm:text-sm font-medium`}/>
                                <p className='text-slate-500 dark:text-slate-200 max-sm:text-sm font-medium'>Like</p>
                            </button>
                            <button className='flex w-full hover:bg-slate-200 justify-center rounded px-2 py-1 cursor-pointer items-center gap-1'>
                                <TfiComment className={` font-medium max-sm:text-xs dark:text-slate-200 text-slate-600`}/>
                                <p className='text-slate-500 max-sm:text-sm dark:text-slate-200 font-medium'>Comment</p>
                            </button>
                        </div>
                        <hr />
                        <div className="flex h-full p-1 flex-col w-full">
                            
                            <div className="flex-grow h-full justify-between p-1 overflow-y-auto gap-2">
                                {
                                    pst?.comments?.length === 0 && (
                                        <div className='w-full flex justify-center items-center'>
                                            <p className='dark:text-slate-100 font-semibold'>No comments yet</p>
                                        </div>
                                    )
                                }
                                {
                                    pst?.comments?.length > 0 && (
                                        pst?.comments.map((cmt, i)=> {
                                            return(
                                                <div key={i} className='flex gap-1 items-center'>
                                                    <Avatarz image={cmt?.user?.profileImg} width={35} height={35}/>
                                                    <div className='p-1 items-start flex-col bg-slate-300 dark:bg-slate-500 flex w-full rounded-md'>
                                                        <p className='dark:text-slate-100 font-semibold'>{cmt?.user?.firstname + " " + cmt?.user?.lastname}</p>
                                                        <p className='dark:text-slate-100 text-sm font-semibold'>{cmt?.text}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                }
                            </div>
                            <div className="sticky flex items-center gap-2 w-full bottom-0  py-3 px-1 shadow-lg">
                                <Avatarz image={user?.profilePic} height={35} width={35}/>
                                <div className='flex gap-1 w-full relative bg-slate-300 dark:bg-slate-500 p-1 rounded-md'>
                                    <div className='flex w-full gap-1'>
                                      <input type="text" className='dark:bg-slate-500 w-full bg-slate-300 outline-none' value={newText} name='newText' onChange={(e)=> setText(e.target.value)} placeholder='Write comment...' /> 
                                      <FaRegFaceSmile className='w-5 h-5 cursor-pointer text-green-700 dark:text-green-300' onClick={() => setShowEmojiPicker(val => !val)} />
                                            {showEmojiPicker && (
                                                <div ref={emojiRef} className={`absolute max-md:bottom-12 md:left-0 md:bottom-10`}> 
                                                    <EmojiPicker skinTonesDisabled={false}  searchDisabled={true} theme='dark' height={300} width="90%"  onEmojiClick={handleEmojiClick} /> 
                                                </div>
                                                )
                                            } 
                                    </div>
                                   
                                    
                                </div>
                                <button className='w-fit'>
                                    <MdSend onClick={commentPost}  className='text-green-500 active:text-green-800 text-[25px]'/>
                                </button> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal  className='custom-modal' open={selectPost !== null} onCancel={handleCloseModal} footer={null}>
                        {selectPost?.image && (
                            <img src={selectPost.image} alt={selectPost.text} className="w-full h-auto" />
                        )}
                        {selectPost?.video && (
                            <video autoPlay={false} controls className="w-full h-auto" src={selectPost.video} type="video/mp4" />
                        )}
                        <button
                            onClick={() => downloadFile(selectPost?.image || selectPost?.video, selectPost?.text)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Download
                        </button>
        </Modal>
    </div>
  )
}

export default FullViewPost