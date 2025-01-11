import React from 'react'
import Avatarz from './Avatar'

const NotificationDropdown = ({notifications, refy, load}) => {
  return (
    <div ref={refy} className='absolute scrollbar p-1 max-sm:w-screen h-96 max-sm:h-screen right-1 max-sm:right-0 bg-white dark:bg-facebookDark-600 w-80 top-14 overflow-y-auto  rounded-md shadow-lg z-10'>
        <div className='w-full'>
            <h1 className='dark:text-slate-100 font-semibold text-xl'>Notifications</h1>
        </div>
        <div className='w-full flex-col flex gap-2'>
            {
                load && (
                    Array.from({ length: 5 }).map((n, i)=>{
                        return(
                            <div key={n?._id} className='flex items-center pt-2'>
                                <div className='w-12 h-12 rounded-full animate-pulse bg-slate-600 dark:bg-slate-400'></div>
                                <div className='w-[80%] h-8 rounded-md animate-pulse bg-slate-600 dark:bg-slate-400'></div>
                            </div>
                        )
                    })
                )
            }
            {
                notifications.length === 0 && !load && (
                    <div className='w-full flex p-2 justify-center'>
                       <p className='dark:text-slate-200'>No notifications found</p> 
                    </div>
                    
                )
            }
            {
                notifications.length !== 0 && !load && (
                    notifications.map((n, i)=> {
                        return(
                            <div key={n?._id} className='flex hover:bg-slate-500 gap-1 items-center p-2 rounded'>
                                <div>
                                    <Avatarz height={35} image={n?.from?.profileImg} width={35} name={(n?.from?.firstname + " " + n?.from?.lastname).toUpperCase()}/>
                                </div>
                                <div className='flex flex-col'>
                                    {
                                        n?.type === 'liked' && (
                                           <p className='text-xs dark:text-slate-200'><span className='font-bold'>{n?.from?.firstname + " " + n?.from?.lastname + " "}</span> reacted to your post</p> 
                                        )
                                    }
                                    {
                                        n?.type === 'newStory' && (
                                           <p className='text-xs dark:text-slate-200'><span className='font-bold'>{n?.from?.firstname + " " + n?.from?.lastname + " "}</span> added a new story</p> 
                                        )
                                    }
                                    {
                                        n?.type === 'newPost' && (
                                           <p className='text-xs dark:text-slate-200'><span className='font-bold'>{n?.from?.firstname + " " + n?.from?.lastname + " "}</span> added a new Post</p> 
                                        )
                                    }
                                    
                                    
                                </div>
                            </div>
                        )
                    })
                )
            }
        </div>
    </div>
  )
}

export default NotificationDropdown