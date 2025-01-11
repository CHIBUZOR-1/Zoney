import React from 'react'

const Photos = ({img}) => {
  return (
    <div className='flex max-[500px]:w-full max-sm:w-full  relative items-center p-2 dark:border-slate-500 border shadow rounded justify-center'>
        <div className=' w-full relative max-sm:h-36 h-56'>
            <img src={img} alt="" className='w-full h-full absolute inset-0 object-fill' />
        </div>
    </div>
  )
}

export default Photos