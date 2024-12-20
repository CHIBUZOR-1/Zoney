import React from 'react'
import ChatSidebar from '../Components/ChatSidebar'
import { Outlet, useLocation } from 'react-router-dom'
import Layout from '../Components/Layout'
import { assets } from '../Components/Assets/assets'

const ChatPage = () => {
    const location = useLocation();
    const basePath = location.pathname === '/messages';
  return (
    <Layout>
      <div className='h-[100vh] overflow-y-hidden'>
        <div className='grid bg-slate-200 max-sm:grid-cols-none grid-cols-[300px,1fr] h-full '>
            <section className={`bg-slate-200 pt-[56px]  ${!basePath && 'hidden'} md:block`}>
              <ChatSidebar/>  
            </section>
            <section className={`${basePath && 'hidden'} pt-[56px]`}>
                <Outlet/>
            </section>
            <div className={`flex max-sm:hidden justify-center items-center ${!basePath && 'hidden'}`}>
              <div className='h-screen flex items-center justify-center'>
                <img src={assets.z} className='h-52 w-52 rounded-md animate-pulse' alt="" />
              </div>
            </div>
        </div>
      </div>
        
    </Layout>
    
  )
}

export default ChatPage