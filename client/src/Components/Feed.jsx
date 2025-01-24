import React, { useEffect, useState } from 'react'
import StoryReel from './StoryReel'
import PostUpload from './PostUpload'
import axios from 'axios'
import ReactLoading from 'react-loading'
import Postz from './Postz'
import { useLocation } from 'react-router-dom'
import FullViewPost from './FullViewPost'

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const location = useLocation();
  const [prevUrl, setPrevUrl] = useState(location.pathname);

  const history = window.history;

  useEffect(()=> {
    getAllPost()
  }, [])
  useEffect(() => {
    if (selectedPost === null) {
      setPrevUrl(location.pathname);
    }
  }, [selectedPost, location.pathname]);
  useEffect(() => {
    window.onpopstate = function(event) {
      if (event.state && event.state.postId) {
        const post = allPosts.find(p => p.id === event.state.postId);
        setSelectedPost(post);
      } else {
        setSelectedPost(null);
      }
    };
  }, [allPosts]);

  
    
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
  const showPost = (post) => { 
    setSelectedPost(post); 
    history.pushState({ postId: post?._id }, '', `/postz/${post?._id}`); 
  }; 
  const closePost = () => { 
    setSelectedPost(null); 
    window.history.back(); 
  };
  
  const handleUpdatePost = (updatedPost) => { 
    setAllPosts(allPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))); 
    setSelectedPost(updatedPost);
  };
  const handleUpdatePostz = (updatedPost) => { 
    setAllPosts(allPosts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
  };

  return (
    <div className='slopey pt-5 mb-3 flex w-[40%] px-1  max-md:pl-2  max-sm:w-full max-sm:px-1 flex-col justify-center'>
      <StoryReel />
      <PostUpload/>
      {
          loading && (
            <div className='flex mt-3 justify-center items-center pt-2'>
              <ReactLoading type="spin" color='black' height={30} width={30}/>
            </div>
                      
          )
      }
      {
          allPosts.length === 0 && !loading && (
            <p className='text-center dark:text-slate-200 text-lg text-slate-400'>No Post found!</p>
          )
      }
      {
        allPosts.length !== 0 && !loading && (
          allPosts.map((post, i)=> {
            return(
              <Postz onUpdatePostz={handleUpdatePostz} onClick={() => showPost(post)} key={post?._id + i} post={post}/>
            )
          })
        )
      }
      {
        selectedPost && ( 
          <FullViewPost onUpdate={handleUpdatePost} pst={selectedPost} close={closePost}/>
        )
      }
    </div>
  )
}

export default Feed