import React from 'react'
import { assets } from './Assets/assets'

const Loading = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
        <img src={assets.z} className='h-52 w-52 rounded-md animate-pulse' alt="" />
    </div>
  )
}

export default Loading