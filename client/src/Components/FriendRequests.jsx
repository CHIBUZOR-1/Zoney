import React, { useEffect, useState } from 'react'
import Avatarz from './Avatar'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FriendRequests = () => {
    const user = useSelector(state=> state?.user);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(()=> {
        fetchRequests()
    }, [user?.userId])

    const fetchRequests = async () => { 
        const res = await axios.get(`/api/requests/friend-requests`);
        setFriendRequests(res.data); 
    };
  return (
    <div className={`flex w-full gap-1 flex-col ${!friendRequests.length ? "block": "block"}`}>
        <hr />
        <div className='flex items-center justify-between'>
            <h3>Friend requests</h3>
            <Link to={"/friends"} className='text-xs text-blue-500 cursor-pointer'>See all</Link>
        </div>
        <div className='w-full flex flex-col gap-3 '>
            <div className='flex justify-between w-full'>
               <div className='flex gap-2 items-center w-full'>
                    <Avatarz height={35} width={35} name={"JOHN BEN"}/>
                    <p className='font-medium'>John Ben</p>
                </div>
                <div className='flex text-xs w-full items-center'>
                    <p className='ml-auto'>1hr</p>
                </div>
            </div>
            
            <div className='flex gap-3 w-full justify-center items-center'>
                <button className='bg-green-600 rounded p-1 text-white active:bg-green-300 font-semibold'>Confirm</button>
                <button className='bg-green-600 rounded active:bg-green-300 p-1 text-white font-semibold '>Reject</button>
            </div>   
        </div>
        {
            friendRequests.map((fs, i) => {
                return(
                    <div className='w-full flex flex-col gap-3' key={i}>
                        <div className='flex justify-between w-full'>
                            <div className='flex gap-2 items-center w-full'>
                                <Avatarz height={35} width={35} name={(fs?.firstname + " " + fs?.lastname).toUpperCase()}/>
                                <p>{(fs?.firstname + " " + fs?.lastname).toUpperCase()}</p>
                            </div>
                            <div className='flex text-xs w-full items-center'>
                                <p className='ml-auto'>1hr</p>
                            </div>
                        </div>
                        <div className='flex gap-3 w-full justify-center items-center'>
                            <button className='bg-green-600 rounded p-1 text-white active:bg-green-300 font-semibold'>Confirm</button>
                            <button className='bg-green-600 rounded p-1 text-white active:bg-green-300 font-semibold'>Reject</button>
                        </div>   
                    </div>
                        
                )
            })
        }
    </div>
  )
}

export default FriendRequests