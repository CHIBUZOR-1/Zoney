import React, { useEffect, useState } from 'react'
import StoryReel from './StoryReel'
import PostUpload from './PostUpload'
import axios from 'axios'
import ReactLoading from 'react-loading'
import Postz from './Postz'

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false)
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
  console.log(allPosts)

  return (
    <div className='w-[40%] ml-[30%] pt-5 flex max-md:ml-0 max-md:w-[75%] max-md:pl-2 max-sm:w-full max-sm:px-1 flex-col justify-center'>
      <StoryReel />
      <PostUpload/>
      {
          loading && (
            <div className='flex justify-center items-center pt-2'>
              <ReactLoading type="spin" color='black' height={30} width={30}/>
            </div>
                      
          )
      }
      {
          allPosts.length === 0 && !loading && (
            <p className='text-center text-lg text-slate-400'>No user found!</p>
          )
      }
      {
        allPosts.length !== 0 && !loading && (
          allPosts.map((post, i)=> {
            return(
              <Postz key={post?._id} img={post?.image} info={post?.text} vid={post?.video} time={post?.createdAt} profile={post?.user}/>
            )
          })
        )
      }
    </div>
  )
}

export default Feed