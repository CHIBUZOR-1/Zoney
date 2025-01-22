import React, { useEffect, useRef, useState } from 'react'
import Avatarz from './Avatar'
import { useSelector } from 'react-redux'
import { RiVideoUploadFill } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { MdOutlineAddReaction } from "react-icons/md";
import { Modal } from 'antd';
import { MdOutlinePhoto } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import { MdOutlineAddToPhotos } from "react-icons/md";
import axios from 'axios';
import { useAuth } from '../Context/AppContext';
import EmojiPicker from 'emoji-picker-react';
import { FaRegFaceSmile } from "react-icons/fa6";




const PostUpload = () => {
    const user = useSelector(state=> state?.user?.user);
    const {socket} = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiRef = useRef(null);
    const [post, setPost] = useState({
        text: "",
        image: null,
        video: null

    });
    const switchUpload = () => {
        setOpenUpload(prev => !prev)
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setPost({
            text: "",
            image: null,
            video: null
    
        })
    };
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
        setPost(prev => ({ ...prev, text: prev.text + emojiObj.emoji })); 
      };
    const handleFileUpload = async (file) => { 
        const formData = new FormData(); 
        formData.append('file', file); 
        try { 
            const response = await axios.post('/api/posts/upload-post-file', formData); 
            return response.data.filePath; 
        } catch (error) { 
            console.error('Error uploading file:', error); 
            return null; 
        } 
    };


    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        let imageUrl = null; 
        let videoUrl = null;
        if (post.image) { imageUrl = await handleFileUpload(post.image); }
        if (post.video) { videoUrl = await handleFileUpload(post.video); }
        const newPost = { text: post.text, image: imageUrl, video: videoUrl };

        try {
            const response = await axios.post('/api/posts/create', newPost);
            if (response.data.success) { 
                setIsModalOpen(false); 
                setPost({ text: "", image: null, video: null }); 
                if (socket) { 
                    const { post } = response.data; 
                    socket.emit('newPost', { 
                        from: user.userId, 
                        to: post.user._id, 
                        postId: post._id }); 
                    }
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    }


    const uploadFile = (e) => {
        const file = e.target.files[0];
        if(file) {
            if (file.type.startsWith('image/')) {
                setPost(prev => ({ ...prev, image: file, video: null }));
            } else if (file.type.startsWith('video/')) {
                setPost(prev => ({ ...prev, video: file, image: null }));
            }
        }
      }
    const clearFile = () => {
        setPost(prev => ({ ...prev, video: null, image: null }));
    }
  return (
    <div className='w-full dark:bg-facebookDark-200 bg-white mt-5 p-2 rounded-md shadow-md flex flex-col justify-between gap-2'>
        <div className='w-full justify-between flex gap-2 items-center p-2'>
            <div className='flex w-fit items-center'>
                <Avatarz id={user?.id} height={40} image={user?.profilePic} width={40} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""} />
            </div>
            <div className='flex items-center w-[90%] rounded-ful'>
                <input onClick={showModal} className='w-full bg-slate-300 p-1 max-sm:text-sm outline-none rounded-full' type="text" placeholder={`What's on your mind? ${user?.firstname + " " + user?.lastname || ""}`} />
            </div>
        </div>
        <hr />
        <div className='flex items-center justify-between p-2'>
            <div className='flex gap-1 items-center'>
                <RiVideoUploadFill className='text-red-500 text-2xl max-sm:text-sm' />
                <p className='font-semibold dark:text-slate-300 max-sm:text-sm text-slate-500'>Videos</p>
            </div>
            <div className='flex items-center gap-1'>
                <FaPhotoVideo className='text-green-500 text-2xl max-sm:text-sm' />
                <p className='font-semibold dark:text-slate-300  max-sm:text-sm text-slate-500'>Photos</p>
            </div>
            <div className='flex gap-1 items-center'>
                <MdOutlineAddReaction className='text-yellow-500 text-2xl max-sm:text-sm' />
                <p className='font-semibold dark:text-slate-300  max-sm:text-sm text-slate-500'>Feeling/actitviy</p>
            </div>
        </div>
        <Modal open={isModalOpen} className='custom-modal'  onOk={handleOk} footer={null} onCancel={handleCancel}>
            <div className='w-full  flex flex-col gap-3'>
                <div className='flex w-full justify-center items-center'>
                    <h1 className='font-semibold dark:text-slate-200 text-2xl'>Create Post</h1>  
                </div>
                <hr />
                <div className='flex gap-2 w-full items-center'>
                    <Avatarz id={user?.id} height={40} width={40} image={user?.profilePic} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""}/>
                    <p className='dark:text-slate-200'>{user?.firstname + " " + user?.lastname}</p>
                </div> 
                <div className='w-full flex gap-1 items-center rounded'>
                    <textarea className='w-full dark:bg-slate-600 max-sm:text-sm dark:text-slate-100 p-1 text-[16px] rounded-md' onChange={({target}) => setPost(m => ({ ...m, text: target.value }))} value={post.text} placeholder={`What's on your mind, ${user?.firstname + " " + user?.lastname}?`}   rows="2" cols="16"></textarea>
                    <FaRegFaceSmile className='w-7 h-7 cursor-pointer text-green-700 dark:text-green-300' onClick={() => setShowEmojiPicker(val => !val)} />
                        {showEmojiPicker && (
                            <div ref={emojiRef} className={`absolute max-md:bottom-12 md:left-0 md:bottom-10`}> 
                                <EmojiPicker skinTonesDisabled={false}  searchDisabled={true} theme='dark' height={300} width="90%"  onEmojiClick={handleEmojiClick} /> 
                            </div>
                            )
                        }
                </div>
                <div className={`h-32 w-full p-2 border rounded ${!openUpload ? "hidden" : "block"}`}>
                    <label htmlFor="uploads">
                        <div className='w-full relative cursor-pointer hover:bg-slate-200 flex flex-col justify-center items-center h-full rounded border'>
                            { post?.image ? ( 
                                        <> 
                                            <img src={URL.createObjectURL(post?.image)} className='h-full w-full aspect-square object-scale-down max-w-sm m-2' alt="" /> 
                                            <button className='absolute top-1 border-1px rounded-full p-2 border-red-500 font-semibold flex items-center justify-center w-10 h-10 right-1' onClick={clearFile}>x</button> 
                                        </> 
                                    ) : ( 
                                            post?.video ? ( 
                                                <div className="relative h-full w-full"> 
                                                    <video controls muted src={URL.createObjectURL(post?.video)} className='h-full w-full aspect-square object-fit max-w-sm m-2'></video> 
                                                    <button className='absolute top-1 border-1px rounded-full p-2 border-red-500 font-semibold flex items-center justify-center w-10 h-10 right-1' onClick={clearFile}>x</button> 
                                                </div> 
                                            ) : ( 
                                        <> 
                                            <MdOutlineAddToPhotos className='text-[20px] text-slate-400' /> 
                                            <p>Add Photo/Video</p> 
                                        </> 
                                    )
                                ) 
                            }
                        </div>
                    </label>
                    <input type="file" id='uploads' onChange={uploadFile} hidden />
                </div>
                <div className='w-full border p-1 rounded flex justify-between'>
                    <div className='dark:text-slate-100 font-medium'>
                        <p>Add to your post</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <MdOutlinePhoto onClick={switchUpload} className='text-green-500 cursor-pointer text-2xl' />
                        <IoIosVideocam onClick={switchUpload} className='text-red-500 cursor-pointer text-2xl'/>
                    </div>
                </div>
                <div className='w-full flex items-center justify-center'>
                    <button disabled={!post.text && !post.image && !post.video} onClick={handleSubmit} className={`text-white ${!post.text && !post.image && !post.video ? 'bg-green-300' : 'bg-green-600 active:bg-green-400'}   p-1 w-[40%] rounded  font-semibold`}>Post</button>
                </div> 
            </div>
            
        </Modal>
    </div>
  )
}

export default PostUpload