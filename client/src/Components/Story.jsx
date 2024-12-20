import React from 'react'
import Avatarz from './Avatar'

const Story = ({imag, profileSrc, title}) => {
  return (
    <div className=' flex flex-col justify-between shadow rounded h-44 w-32 relative'>
      <div className='w-full h-full'>
        <img src={imag} alt="" />
      </div>
        <Avatarz height={35} width={35} image={profileSrc} />
        <h4 className='font-medium'>{title}</h4>
    </div>
  )
}

export default Story