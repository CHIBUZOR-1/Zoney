import React from 'react'
import Avatarz from './Avatar'
import moment from 'moment'
import { SlLike } from "react-icons/sl";
import { TfiComment } from "react-icons/tfi";
import { IoIosShareAlt } from "react-icons/io";<IoIosShareAlt />

const Postz = ({info, img, vid, time, profileSrc, profile, comment, like}) => {
  return (
    <div className='w-full flex flex-col gap-3 p-1 bg-white mt-4 mb-1 rounded shadow-md'>
      <div className='flex gap-2 items-center w-full'>
        <Avatarz height={35} userId={profile?._id} width={35} image={profileSrc} name={(profile?.firstname+ " " + profile?.lastname).toUpperCase() || ""}/>
        <div className='flex flex-col'>
         <p className='text-xs'>{(profile?.firstname+ " " + profile?.lastname).toUpperCase()}</p>
         <p className='text-xs'>{moment(time).format('LT')}</p>
        </div>
      </div>
      <div>
        <p className='line-clamp-1 text-ellipsis'>{info}</p>
      </div>
      <div>
        {
          img && (
            <div className='w-full h-[300px]'>
              <img src={img} className='h-full w-full object-center' alt="" />
            </div>
          )
        }
        {
          vid && (
            <div className='w-full'>
              <video src={vid}></video>
            </div>
          )
        }
      </div>
      <div className='flex justify-between w-full items-center px-2 p-1'>
        <div className='flex items-center gap-1'>
          <SlLike  />
          <p className='text-slate-500'>Like</p>
        </div>
        <div className='flex items-center gap-1'>
          <TfiComment />
          <p className='text-slate-500'>Comment</p>
        </div>
        <div className='flex items-center gap-1'>
          <IoIosShareAlt />
          <p className='text-slate-500'>Share</p>
        </div>
      </div>
    </div>
  )
}

export default Postz