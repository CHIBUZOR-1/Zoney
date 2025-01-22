import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading'
import { TfiComment } from "react-icons/tfi";
import { IoMdThumbsUp } from "react-icons/io";
import Avatarz from '../Components/Avatar';
import { calculateTime, formatNumber } from '../Client-Utils/CalculateTime';
import { MdSend } from 'react-icons/md';
import axios from 'axios';
import VideoFeedsView from '../Components/VideoFeedsView';
import Layout from '../Components/Layout';
import { IoArrowBack } from "react-icons/io5";


const VideosFeeds = () => {
    const { socket } = useAuth();
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const users = useSelector(state => state?.user?.user);
    const [newText, setText] = useState('')
    const [selectedPost, setSelectedPost] = useState(null);
    const [show, setShow] = useState(false);
    const location = useLocation();
    const [prevUrl, setPrevUrl] = useState(location.pathname);
    const history = window.history;

    useEffect(()=> {
        getAllPost()
      }, [])
    
      
        
      const getAllPost = async()=> {
        try {
          setLoading(true)
          const { data } = await axios.get('/api/posts/all-posts');
          if(data.success) {
            setAllPosts(data.posts)
            setLoading(false)
          }
        } catch (error) {
          console.error('Error creating post:', error);
        }
    
      } 

      const handleUpdatePost = (updatedPost) => { 
        setAllPosts(allPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))); 
        setSelectedPost(updatedPost);
      };
  
    const commentPost = async(pick)=> {
      try {
        const {data} = await axios.post(`/api/posts/comment/${pick?._id}`, {newText}); 
        setText('')
        handleUpdatePost(data.post); 
        setShow(false)
        if (socket && pick?.user?._id !== users.id) { 
          socket.emit('commentz', { 
            from: users?.id, 
            to: pick?.user?._id, 
            liked: true 
          }); 
        }
      } catch (error) {
        console.error('Error commenting on post:', error); 
      }
    }
    
    const handleLikeUnlikez = async (pick) => { 
      try { 
        const {data} = await axios.post(`/api/posts/like/${pick?._id}`); 
        handleUpdatePost(data.updatedPost); 
        if (socket && !pick.likes.includes(users.id) && pick?.user?._id !== users?.id) { 
          socket.emit('postLiked', { 
            from: users.id, 
            to: pick?.user?._id, 
            liked: true 
          }); 
        }
      } catch (error) { 
        console.error('Error liking/unliking post:', error); 
      } 
    };
    const showPost1 = (post) => { 
        window.onpopstate = function(event) { 
            if (event.state && event.state.postId) { 
              const post = allPosts.find(p => p.id === event.state.postId); 
              setSelectedPost(post); 
            } else { 
              setSelectedPost(window.location.pathname); 
            } 
          };
        setSelectedPost(post); 
        history.pushState({ postId: post?._id }, '', `/videofeeds/${post?._id}`); 
    }; 
    const closePost1 = () => { 
        setSelectedPost(null); 
        history.pushState({}, '', prevUrl); 
      };
    const display =(e)=> {
      e.stopPropagation()
      setShow(prev=> !prev)
    }
    const vid = allPosts.filter(pst => pst.video);
  return (
    <Layout>
        <div className='w-full flex overflow-hidden dark:bg-facebookDark-500 bg-slate-100 h-full'>
            <div className='bg-white max-md:hidden max-md:max-w-[35%] dark:bg-facebookDark-300 w-full max-w-[27%] max-sm:max-w-full pr-2 max-sm:px-2 shadow-md border-t-0 h-full'>
                    <aside className='flex pt-14 h-screen max-sm:h-full max-sm:pb-2 flex-col pl-4 max-sm:w-full gap-4'>
                          <h1 className='font-semibold dark:text-slate-200 text-slate-700 text-2xl'>Videos</h1>
                          <Link to={'/home'} style={{ textDecoration: 'none ', color: 'inherit'}} className='cursor-pointer dark:hover:text-black rounded-md flex gap-3  items-center hover:bg-slate-600 px-3 h-[40px] text-[20px] border'>
                            <IoArrowBack className='dark:text-slate-200 ' />
                            <p  className=' flex dark:text-slate-200 justify-between '> Home</p>
                          </Link>
                    </aside>
            </div>
            <div className='w-full flex relative  items-center p-2 h-screen'>
              <div className='h-full flex flex-col items-center scrollbar max-sm:pt-16 pt-12 overflow-y-auto w-full'>
                <Link to={'/home'} className='absolute max-sm:left-1 max-sm:h-10 max-sm:w-10 flex items-center md:hidden justify-center max-sm:text-xs p-2 z-30 rounded-full dark:bg-slate-300 top-16  left-3'><IoArrowBack className='dark:text-slate-700 ' /></Link>
                {
                    loading && (
                        <div className='flex w-full mt-3 justify-center items-center pt-2'>
                            <ReactLoading type="spin" color='black' height={30} width={30}/>
                        </div>
                                    
                    )
                }
                {
                    vid.length === 0  && !loading && (
                        <p className='text-center dark:text-slate-200 text-lg text-slate-400'>No Videos found!</p>
                    )
                }
                
                {
                    vid.length !== 0 && !loading && (
                        vid.map((pst, i)=> {
                            return(
                                <div key={i} className='max-sm:w-[85%] w-[70%] h-full  dark:bg-facebookDark-200 flex flex-col gap-3 p-1 bg-white mt-4 mb-1 rounded shadow-lg'>
                                    <div className='flex dark:text-slate-200 font-medium justify-between gap-2 items-center w-full'>
                                        <div className='flex items-center gap-2'>
                                            <Avatarz height={35} id={pst?.user?._id} width={35} image={pst?.user?.profileImg} name={(pst?.user.firstname+ " " + pst?.user.lastname).toUpperCase() || ""}/>
                                            <div className='flex flex-col'>
                                                <p className='text-xs'>{(pst?.user?.firstname + " " + pst?.user?.lastname).toUpperCase()}</p>
                                                <p className='text-xs'>{calculateTime(pst?.createdAt)}</p>
                                            </div>
                                        </div>
                                    
                                    </div>
                                    <div className='dark:text-slate-200 font-medium'>
                                        <p className='line-clamp-1 text-ellipsis'>{pst?.text}</p>
                                    </div>
                                    <div className={`${pst?.video ? "block" : "hidden"} h-[400px] relative{}`}>
                                        <div onClick={()=> showPost1(pst)} className='w-full cursor-pointer h-full relative'>
                                            <video controls src={`/${pst?.video}`} className='h-full w-full absolute object-fill inset-0 max-sm:object-cover '/>
                                        </div>
                                    </div>
                                    <div className='p-1 flex justify-between text-xs'>
                                        <p className='text-slate-700 dark:text-slate-200'>{formatNumber(pst?.likes?.length) + " likes"}</p>
                                        <p className='text-slate-700 dark:text-slate-200'>{formatNumber(pst?.comments?.length) + " comments"}</p>
                                    </div>
                                    <hr />
                                    <div className='flex  justify-between w-full items-center px-2 p-1'>
                                        <button onClick={handleLikeUnlikez} className='flex hover:bg-slate-200 rounded cursor-pointer px-2 py-1 items-center gap-1'>
                                            <IoMdThumbsUp  className={`${pst.likes.includes(users?.id) ? 'text-red-500' : 'text-slate-500 dark:text-slate-200'} max-sm:text-sm font-medium`}/>
                                            <p className='text-slate-500 dark:text-slate-200 max-sm:text-sm font-medium'>Like</p>
                                        </button>
                                        <button onClick={display} className='flex hover:bg-slate-200 rounded px-2 py-1 cursor-pointer items-center gap-1'>
                                            <TfiComment className='font-medium max-sm:text-sm dark:text-slate-200 text-slate-600'/>
                                            <p className='text-slate-500 max-sm:text-sm dark:text-slate-200 font-medium'>Comment</p>
                                        </button>
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
                        })
                    )
                }
              </div>
            </div>
            {
                selectedPost && ( 
                <VideoFeedsView onUpdate={handleUpdatePost} pst={selectedPost} close={closePost1}/>
                )
            }
        </div>
    </Layout>
  )
}

export default VideosFeeds