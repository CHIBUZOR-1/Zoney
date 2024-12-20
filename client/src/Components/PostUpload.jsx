import React, { useState } from 'react'
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




const PostUpload = () => {
    const user = useSelector(state=> state?.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [post, setPost] = useState({
        text: "",
        image: null,
        video: null

    })
    console.log(post)
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
                setPost({ text: "", image: null, video: null }); }
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
    <div className='w-full bg-white mt-5 p-2 rounded-md shadow-md flex flex-col justify-between gap-2'>
        <div className='w-full justify-between flex gap-2 items-center p-2'>
            <div className='flex items-center'>
                <Avatarz userId={user?.userId} height={40} width={40} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""} />
            </div>
            <div className='flex items-center w-full rounded-ful'>
                <input onClick={showModal} className='w-full bg-slate-300 p-1 outline-none rounded-full' type="text" placeholder={`What's on your mind? ${user?.firstname + " " + user?.lastname || ""}`} />
            </div>
        </div>
        <hr />
        <div className='flex items-center justify-between p-2'>
            <div className='flex gap-1'>
                <RiVideoUploadFill className='text-red-500 text-2xl' />
                <p className='font-semibold max-sm:text-sm text-slate-500'>Live video</p>
            </div>
            <div className='flex gap-1'>
                <FaPhotoVideo className='text-green-500 text-2xl' />
                <p className='font-semibold max-sm:text-sm text-slate-500'>Photo/video</p>
            </div>
            <div className='flex gap-1'>
                <MdOutlineAddReaction className='text-yellow-500 text-2xl' />
                <p className='font-semibold max-sm:text-sm text-slate-500'>Feeling/actitviy</p>
            </div>
        </div>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div className='w-full flex flex-col gap-3'>
                <div className='flex w-full justify-center items-center'>
                    <h1 className='font-semibold text-2xl'>Create Post</h1>  
                </div>
                <hr />
                <div className='flex gap-2 w-full items-center'>
                    <Avatarz userId={user?.userId} height={40} width={40} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""}/>
                    <p>{user?.firstname + " " + user?.lastname}</p>
                </div> 
                <div className='w-full rounded'>
                    <textarea className='w-full p-1 text-[16px]' onChange={({target}) => setPost(m => ({ ...m, text: target.value }))} value={post.text} placeholder={`What's on your mind, ${user?.firstname + " " + user?.lastname}?`}   rows="4" cols="16"></textarea>
                </div>
                <div className={`h-32 w-full p-2 border rounded ${!openUpload ? "hidden" : "block"}`}>
                    <label htmlFor="uploads">
                        <div className='w-full relative cursor-pointer hover:bg-slate-200 flex flex-col justify-center items-center h-full rounded border'>
                            { post?.image ? ( 
                                        <> <img src={URL.createObjectURL(post?.image)} className='h-full w-full aspect-square object-scale-down max-w-sm m-2' alt="" /> 
                                        <button className='absolute top-1 border-1px rounded-full p-2 border-red-500 font-semibold flex items-center justify-center w-10 h-10 right-1' onClick={clearFile}>x</button> </> 
                                    ) : ( 
                                            post?.video ? ( 
                                                <div className="relative"> 
                                                    <video controls autoPlay muted src={URL.createObjectURL(post?.video)} className='h-full w-full aspect-square object-scale-down max-w-sm m-2'></video> 
                                                    <button className='absolute top-1 border-1px rounded-full p-2 border-red-500 font-semibold flex items-center justify-center w-10 h-10 right-1' onClick={clearFile}>x</button> </div> 
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
                    <div className=''>
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