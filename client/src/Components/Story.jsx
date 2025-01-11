import React from 'react'
import Avatarz from './Avatar'

const Story = ({stry}) => {
  return (
    <div className=' flex-none flex-col justify-between shadow rounded-md h-44 w-32 relative'>
      <div className='w-full rounded-md h-full'>
        <img src={`/${stry.media}`} className='rounded-md w-full h-full' alt="" />
      </div>
      <div className='absolute border border-2px border-green-500 rounded-full top-1 left-2 flex items-center justify-center '>
        <Avatarz height={40} width={40} image={stry?.user?.profileImg} name={(stry?.user?.firstname + " " + stry?.user?.lastname).toUpperCase()} />
      </div>
      <div className='absolute w-full bottom-3 justify-center flex text-white font-semibold'>
        <h4 className='font-medium'>{stry?.user?.firstname + " " + stry?.user?.lastname}</h4>
      </div>
        
    </div>
  )
}

export default Story