import React from 'react'

const Photos = ({img, vid}) => {
  return (
    <div className='flex max-[500px]:w-full max-sm:w-full  relative items-center p-2 dark:border-slate-500 border shadow rounded justify-center'>
        <div className=' w-full relative max-sm:h-36 h-56'>
          {
            img && (
              <img src={`/${img}`} alt="" className='w-full h-full absolute inset-0 object-fill' />
            )
          }
          {
            vid && (
              <video src={`/${vid}`} className='w-full h-full absolute inset-0 object-fill' controls/>
            )
          }
            
        </div>
    </div>
  )
}

export default Photos