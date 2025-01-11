import React from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { LiaUserFriendsSolid } from 'react-icons/lia'
import { MdOutlineSchool, MdWorkOutline } from 'react-icons/md'
import { TiHomeOutline } from 'react-icons/ti'
import { formatNumber } from '../Client-Utils/CalculateTime'

const AboutProfileView = ({userBio}) => {
  return (
    <div className='md:w-[40%] p-2 flex flex-col mt-4 h-fit gap-1 border rounded'>
        <h2 className='font-medium'>Intro</h2>
        <p className='font-medium'>{userBio?.about?.bio}</p>
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2 items-center'>
                <TiHomeOutline className='text-slate-600 dark:text-slate-300' />
                    <span className='font-medium'>Lives in : {userBio?.about?.city}</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <IoLocationOutline  className='text-red-400 dark:text-slate-300'/>
                    <span className='font-medium'>From : {userBio?.about?.country}</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <MdWorkOutline className='text-slate-600 dark:text-slate-300' />
                    <span className='font-medium'>Works at : {userBio?.about?.worksAt}</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <MdOutlineSchool className='text-slate-600 dark:text-slate-300' />
                    <span className='font-medium'>Studied at : {userBio?.about?.education}</span>
                </div>
                <div className='flex gap-2 items-center'>
                    <LiaUserFriendsSolid className='text-slate-600 dark:text-slate-300' />
                    <span className='font-medium'>Followed by : {formatNumber(userBio?.friends.length)} {userBio?.friends.length <= 1? "person" : "people"}</span>
                </div>
        </div>
    </div>
  )
}

export default AboutProfileView