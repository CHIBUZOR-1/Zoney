import React from 'react'
import { GrGroup } from 'react-icons/gr'
import { MdOutlineOndemandVideo } from 'react-icons/md'
import { TiHome } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";

const MenuList = ({refy}) => {
  const user = useSelector(state => state?.user?.user);
  return (
    <div ref={refy} className='absolute shadow-md top-14 gap-2 p-1 w-40 dark:bg-facebookDark-300 z-10 bg-slate-200 flex flex-col rounded'>
        <Link to={'/home'} className='gap-2 active:bg-green-300 hover:border-green-300 hover:border cursor-pointer font-semibold flex items-center px-1 rounded-md'>
            <div className='bg-slate-100 dark:bg-slate-400 dark:text-slate-100 hover:border-green-300 hover:border cursor-pointer h-10 w-10 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
              <TiHome />  
            </div>
            <p className='dark:text-slate-200 font-semibold'>Home</p>
        </Link>
        <Link to={'/videos'} className='gap-2 hover:border-green-300 hover:border cursor-pointer font-semibold flex items-center px-1 rounded-md'>
            <div className='bg-slate-100 dark:bg-slate-400 dark:text-slate-100 hover:border-green-300 hover:border cursor-pointer h-10 w-10 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
                <MdOutlineOndemandVideo  /> 
            </div>
            <p className='dark:text-slate-200 font-semibold'>Videos</p>
        </Link>
        <Link to={`/Profile/${user?.id}`} className='gap-2 hover:border-green-300 hover:border cursor-pointer font-semibold flex items-center px-1 rounded-md'>
            <div className='bg-slate-100 dark:bg-slate-400 dark:text-slate-100 hover:border-green-300 hover:border cursor-pointer h-10 w-10 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
              <CgProfile className='dark:text-slate-300 text-slate-500' />
            </div>
            <p className='dark:text-slate-200 font-semibold'>Profile</p>
        </Link>
        <Link to={"/friends?view=my_friends"} className='gap-2 hover:border-green-300 hover:border cursor-pointer font-semibold flex items-center px-1 rounded-md'>
            <div className='bg-slate-100 dark:bg-slate-400 dark:text-slate-100 hover:border-green-300 hover:border cursor-pointer h-10 w-10 font-semibold flex justify-center text-[18px] items-center px-1 rounded-full'>
                <GrGroup className='dark:text-slate-300 text-slate-500' />
            </div>
            <p className='dark:text-slate-200 font-semibold'>Friends</p>
        </Link>
    </div>
  )
}

export default MenuList