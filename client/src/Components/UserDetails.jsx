import React from 'react'
import { TiHomeOutline } from "react-icons/ti";
import { FaRegHeart } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdWorkOutline } from "react-icons/md";
import { MdOutlineSchool } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { formatNumber } from '../Client-Utils/CalculateTime';
import { useSelector } from 'react-redux';






const UserDetails = ({userBio, mod, paramId}) => {
  const user = useSelector(state => state?.user?.user)
  const friendsCount = userBio?.friends ? userBio.friends.length : 0;
  return (
    <div className='md:w-[40%] p-2 flex flex-col shadow-lg mt-4 h-fit gap-1 border rounded'>
        <h2 className='font-medium'>Intro</h2>
        <p className='font-medium'>{userBio?.about?.bio}</p>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2 items-center'>
            <TiHomeOutline className='text-slate-600 dark:text-slate-300' />
            <span className='font-medium'>Lives in : {userBio?.about?.city}</span>
          </div>
          <div className='flex gap-2  items-center'>
            <IoLocationOutline  className='text-red-400 dark:text-slate-300'/>
            <span className='font-medium'>From : {userBio?.about?.country}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <MdWorkOutline className='text-slate-600 dark:text-slate-300' />
            <span className='font-medium '>Works at : {userBio?.about?.worksAt}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <MdOutlineSchool className='text-slate-600 dark:text-slate-300' />
            <span className='font-medium'>Studied at : {userBio?.about?.education}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <LiaUserFriendsSolid className='text-slate-600 dark:text-slate-300' />
            <span className='font-medium'>Followed by : {formatNumber(friendsCount)} {friendsCount <= 1? "person" : "people"}</span>
          </div>
          <div  className='flex items-center justify-center'>
            <button onClick={()=> mod()} className={`${paramId === user.id ? "block": "hidden"} p-2 w-[60%] border cursor-pointer active:bg-green-500 rounded bg-green-800 font-medium text-white `}>Edit Bio</button>
          </div>
        </div>
    </div>
  )
}

export default UserDetails