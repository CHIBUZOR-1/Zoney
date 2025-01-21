import React from 'react'
import { useNavigate } from 'react-router-dom'

const RegistrationNote = () => {
    const navigate = useNavigate();
  return (
        <div className='flex dark:bg-facebookDark-200  flex-col pt-5 h-full gap-2 justify-center items-center px-1'>
            <h2 className='text-[29px] dark:text-slate-200 max-sm:text-[20px] font-semibold'>Registration Successful!</h2>
            <p className='text-[16px] dark:text-slate-200 max-sm:text-[10px]'>A verification link will be sent to you registered email to complete your registration.</p>
            <button onClick={()=> navigate('/')} className='p-2 active:bg-green-800 text-slate-200 font-semibold bg-green-500 rounded-md'>Done</button>
        </div>
  )
}

export default RegistrationNote