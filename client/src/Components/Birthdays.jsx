import React from 'react'
import { FaGift } from "react-icons/fa6";

const Birthdays = () => {
  return (
    <div className='w-full p-2'>
        <hr />
        <h2 className='text-slate-400 font-semibold'>Birthdays</h2>
        <div className='flex gap-2 p-2'>
            <FaGift className='text-blue-600 text-[24px]' />
            <p className='text-sm dark:text-white'><span className='font-semibold dark:text-white'>Mustafa</span> and <span className='font-semibold'>2 others</span> have birthdays today.</p>
        </div>
    </div>
  )
}

export default Birthdays