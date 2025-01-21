import React, { useState } from 'react'
import Avatarz from './Avatar'
import { useAuth } from '../Context/AppContext';
import { TfiComment } from "react-icons/tfi";
import { IoMdThumbsUp } from "react-icons/io";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { calculateTime, formatNumber } from '../Client-Utils/CalculateTime';
import { MdSend } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading'


const Postz = ({onUpdatePostz, path, onClick, onDelete, post}) => {
  const { socket } = useAuth();
  const users = useSelector(state => state?.user?.user);
  const [newText, setText] = useState('')
  const location = useLocation();
  const basePath1 = location.pathname === path;
  const [drop, setDrop] = useState(false)
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false)
  console.log("path",basePath1);
  console.log(post)

  const commentPost = async(e)=> {
    e.stopPropagation();
    try {
      const {data} = await axios.post(`/api/posts/comment/${post?._id}`, {newText}); 
      setText('')
      onUpdatePostz(data.post); 
      setShow(false)
      console.log(data.post)
      if (socket && post?.user?._id !== users.id) { 
        socket.emit('commentz', { 
          from: users?.id, 
          to: post?.user?._id, 
          liked: true 
        }); 
      }
    } catch (error) {
      console.error('Error commenting on post:', error); 
    }
  }
  const handleDrop = (e)=> {
    e.stopPropagation();
    setDrop(prev => !prev)
  }
  const handleDeletePost = async(id) => {
    setLoader(true)
    const {data} = await axios.delete(`/api/posts/delete-post/${id}`)
    if(data.success) {
      toast.success('Post deleted'); 
      onDelete(id)
      setLoader(false)
    }
  }
  console.log(newText)
  const handleLikeUnlikez = async () => { 
    try { 
      const {data} = await axios.post(`/api/posts/like/${post._id}`); 
      onUpdatePostz(data.updatedPost); 
      console.log(data.updatedPost)
      if (socket && !post.likes.includes(users.id) && post?.user?._id !== users?.id) { 
        socket.emit('postLiked', { 
          from: users.id, 
          to: post.user, 
          liked: true 
        }); 
      }
    } catch (error) { 
      console.error('Error liking/unliking post:', error); 
    } 
  };
  const display =(e)=> {
    e.stopPropagation()
    setShow(prev=> !prev)
  }

  


  return (
    <div  className='w-full dark:bg-facebookDark-200 flex flex-col gap-3 p-1 bg-white mt-4 mb-1 rounded shadow-lg'>
      <div className='flex dark:text-slate-200 font-medium justify-between gap-2 items-center w-full'>
        <div className='flex items-center gap-2'>
          <Avatarz height={35} id={post?.user?._id} width={35} image={post?.user?.profileImg} name={(post?.user.firstname+ " " + post?.user.lastname).toUpperCase() || ""}/>
          <div className='flex flex-col'>
            <p className='text-xs'>{(post?.user?.firstname + " " + post?.user?.lastname).toUpperCase()}</p>
            <p className='text-xs'>{calculateTime(post?.createdAt)}</p>
          </div>
        </div>
        <div className='flex gap-1 cursor-pointer relative items-center'>
          <ReactLoading className={`${loader ? "block" : "hidden"}`} type="spin" height={10} width={10}/>
          <PiDotsThreeOutlineFill className={`${basePath1 && post?.user?._id === users?.id ? 'block': 'hidden'}`} onClick={handleDrop}/>
           { drop && (
              <div className='absolute flex items-center justify-center shadow-lg broder bg-slate-300 rounded-md dark:bg-facebookDark-300 -bottom-10 right-0 w-28'>
                <button className='p-2 dark:text-slate-100 ' onClick={()=>{handleDeletePost(post._id); setLoader(false)}}>Delete post</button>
              </div>
            )} 
        </div>
        
      </div>
      <div className='dark:text-slate-200 font-medium'>
        <p className='line-clamp-1 text-ellipsis'>{post?.text}</p>
      </div>
      <div className={`${post?.image || post?.video ? "block" : "hidden"} h-[400px] relative{}`}>
        {
          post?.image && (
            <div onClick={onClick} className='w-full ratte h-full flex items-center justify-center overflow-hidden cursor-pointer relative '>
              <img  src={`/${post?.image}`} className='w-full h-full  absolute inset-0 object-cover' alt="" />
              
            </div>
          )
          
        }
        
        {
          post?.video && (
            <div onClick={onClick} className='w-full cursor-pointer h-[400px] relative'>
              <video controls src={`/${post?.video}`} className='h-full w-full absolute inset-0 object-cover'/>
            </div>
          )
        }
      </div>
      <div className='p-1 flex justify-between text-xs'>
        <p className='text-slate-700 dark:text-slate-200'>{formatNumber(post?.likes?.length) + " likes"}</p>
        <p className='text-slate-700 dark:text-slate-200'>{formatNumber(post?.comments?.length) + " comments"}</p>
      </div>
      <hr />
      <div className='flex  justify-between w-full items-center px-2 p-1'>
        <button onClick={handleLikeUnlikez} className='flex hover:bg-slate-200 rounded cursor-pointer px-2 py-1 items-center gap-1'>
          <IoMdThumbsUp  className={`${post.likes.includes(users?.id) ? 'text-red-500' : 'text-slate-500 dark:text-slate-200'} max-sm:text-sm font-medium`}/>
          <p className='text-slate-500 dark:text-slate-200 max-sm:text-sm font-medium'>Like</p>
        </button>
        <button onClick={display} className='flex hover:bg-slate-200 rounded px-2 py-1 cursor-pointer items-center gap-1'>
          <TfiComment className='font-medium max-sm:text-sm dark:text-slate-200 text-slate-600'/>
          <p className='text-slate-500 max-sm:text-sm dark:text-slate-200 font-medium'>Comment</p>
        </button>
        {/***<button className='flex  hover:bg-slate-200 px-2 py-1 rounded cursor-pointer items-center gap-1'>
          <IoIosShareAlt  className='font-medium max-sm:text-xs dark:text-slate-200 text-slate-600'/>
          <p className='text-slate-500 max-sm:text-xs dark:text-slate-200 font-medium'>Share</p>
        </button>***/}
      </div>
      <div className={`flex flex-col ${show? "block": "hidden"}`}>
        <hr />
        <div>
          <p className='dark:text-slate-200 text-slate-700'>Comment</p>
        </div>
        <div className='flex gap-1 items-center'>
          <div className='w-fit'>
            <Avatarz id={users.id} name={(users?.firstname + " " + users?.lastname).toUpperCase()} image={users?.profilePic} height={33} width={37}/>
          </div>
          <input type="text" value={newText} onChange={(e)=> setText(e.target.value)} placeholder='Write a comment' onClick={(e) => e.stopPropagation()}  className='border bg-slate-100 px-1 rounded w-full'/>
          <MdSend onClick={commentPost}  className='dark:text-slate-200 text-[25px]'/>
        </div>
      </div>
      
    </div>
  )
}

export default Postz