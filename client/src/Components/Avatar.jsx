import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { Avatar } from "antd";

const Avatarz = ({userId, name, image, width, height}) => {
    const onlineUser = useSelector(state => state?.user?.onlineUser);
    let avatarName = "";
    if(name) {
        const splitName = name?.split(" ");

        if (splitName.length > 1) {
            avatarName = splitName[0][0]+splitName[1][0]
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
    const isOnline = onlineUser?.includes(userId);
     const randNum = Math.floor(Math.random() * 9)
  return (
    <div className={`text-slate-800 border w-fit text-xl font-bold relative shadow rounded-full ${bgColor[randNum]}`}>
        {
            image? (
                <img src={image} className='overflow-hidden rounded-full' width={width} height={height} alt={name} />
            ) : (
                name? (
                    <div style={{width : width+'px', height : height+"px"}} className='overflow-hidden flex justify-center items-center rounded-full'>
                        {avatarName.toString()}
                    </div>
                ) : (
                    <Avatar size={40} />
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