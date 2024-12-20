import { Avatar } from 'antd';
import React from 'react'
import { FaCamera } from "react-icons/fa";
import Avatarz from '../Components/Avatar';
import Layout from '../Components/Layout'
import { Tabs } from 'antd';



const ProfilePage = () => {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: 'Posts',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'About',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Friends',
      children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label: 'Photos',
      children: 'Content of Tab Pane 3',
    }
  ];
  return (
    <Layout>
      <div className='relative mt-14'>
        <div className='relative h-48 bg-slate-300 overflow-hidden'>
          <img src="" alt="" className='w-full h-full object-cover' />
          <button className='right-4 bottom-4 absolute flex gap-2 cursor-pointer items-center p-1 rounded font-medium text-sm bg-slate-50'><FaCamera /><span className='hidden sm:block'>Edit Cover image</span></button>
        </div>
        <div className='z-10 mx-auto px-4 -mt-14 relative'>
          <div className='flex flex-col items-center md:items-end gap-3 md:flex-row'>
            <div className='border-[3px] relative border-green-400 w-fit rounded-full'>
              <Avatarz height={95} width={95} name={'Fes'} />
              <div className='absolute cursor-pointer rounded-full w-8 h-8 bottom-1 p-2 bg-slate-200 flex items-center justify-center -right-2 shadow'><FaCamera /></div>
            </div>
            <div className='flex text-center'>
              <h1>Homo Sapien</h1>
            </div>
          </div>
          
        </div>
        <div className='w-full'>
          <Tabs size='large' tabBarGutter={50} className='w-full' defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
        
      </div>
    </Layout>
  )
}

export default ProfilePage