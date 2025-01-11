import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Avatarz = ({id, name, image, width, height}) => {
    const onlineUser = useSelector(state => state?.user?.onlineUser);
    let avatarName = "";
    if(name) {
        const splitName = name?.split(" ");

        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0]
        } else {
            avatarName = splitName[0][0]
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-cyan-200',
        'bg-sky-200',
        'bg-blue-200',
        'bg-gray-200',
        'bg-yellow-200'
    ]
    const isOnline = onlineUser?.includes(id);
     const randNum = Math.floor(Math.random() * 9) ;
     const imgSrc = image ? (image.startsWith('http') || image.startsWith('blob:') ? image : `/${image}`) : null;
     //(image.startsWith('http') || image.startsWith('blob:') ? image : `/${image}`)
     //const imgSrc = image ? (image.startsWith('uploads') ? `/${image}` : image) : null;
  return (
    <div className={`text-slate-800 border w-fit h-fit text-xl font-bold shadow rounded-full ${bgColor[randNum]}`}>
        {
            image? (
                <div className='rounded-full flex items-center justify-center relative' style={{width : width+'px', height : height+"px"}}>
                   <img src={imgSrc} className='absolute rounded-full inset-0 object-fill w-full h-full' alt={name} /> 
                </div>
                
            ) : (
                name? (
                    <div style={{width : width+'px', height : height+"px"}} className='relative flex justify-center items-center rounded-full'>
                        <p className=' h-fit w-fit'>{avatarName.toString()}</p>
                    </div>
                ) : (
                    <FaRegCircleUser />
                )
            )
        }
        {
            isOnline && (
                <div className='bg-green-400 p-1 absolute bottom-2 -right-1 z-10 rounded-full'></div>
            )
        }
    </div>
  )
}

export default Avatarz