import React, { useState } from 'react'
import Story from './Story'
import { IoMdAdd } from "react-icons/io";
import { storis } from '../Client-Utils/CalculateTime';


const StoryReel = () => {
    const [storys, setStorys] = useState([]);
    console.log(storys)
    const image = "https://th.bing.com/th/id/R.1a55f5ba7e7b362606d795d937c1a756?rik=9kFAUyaW%2fndJzg&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1518568814500-bf0f8d125f46%3fixlib%3drb-1.2.1%26q%3d80%26fm%3djpg%26crop%3dentropy%26cs%3dtinysrgb%26w%3d1080%26fit%3dmax%26ixid%3deyJhcHBfaWQiOjEyMDd9&ehk=%2fv8YRvLrlL4HUO0ZkMIErygOtLDDjC25LZlmksp6Ttc%3d&risl=&pid=ImgRaw&r=0";
  return (
    <div className="flex relative gap-3 p-1">
        <div className="flex h-44 w-32 rounded relative shadow  flex-col bg-white items-center"> 
            <div className='w-full '>
                <img src={image} className='h-[70%] absolute w-full object-cover rounded' alt="" />
            </div>
            <div className="flex rounded-full border-white cursor-pointer active:bg-green-500 border-[3px] bg-green-700 absolute w-10 h-10  justify-center items-center bottom-[10%] mb-2"> 
                <IoMdAdd className='text-white' />
            </div> 
            <p className="text-sm absolute bottom-1 font-medium ">Create story</p> 
        </div>
    </div>
  )
}

export default StoryReel