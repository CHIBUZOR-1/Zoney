import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Avatarz from './Avatar';
import { useSelector } from 'react-redux';
import { calculateTime } from '../Client-Utils/CalculateTime';
import { IoArrowBackOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';


const AllRequests = () => {
    const user = useSelector(state => state?.user);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(()=> {
        fetchRequests()
    }, [user?.userId])

    const fetchRequests = async () => { 
        const res = await axios.get(`/api/requests/friend-requests`);
        setFriendRequests(res.data); 
    };
    const acceptRequest = async(requestId) => {
        const {data} = await axios.post('/api/requests/accept-request', { requestId })
    }
    const rejectRequest = async(requestId) => {
        const {data} = await axios.post('/api/requests//reject-request', { requestId })
    }
    console.log(friendRequests)


  return (
    <div className='pt-4 flex flex-col gap-2 px-1'>
        <div className='w-full flex gap-3 items-center'>
            <Link to={"/friends?view=my_friends"} className='sm:hidden'>
                <IoArrowBackOutline className='text-slate-100' />
            </Link>
            <h1 className='dark:text-slate-200 font-semibold text-xl'>Friend Requests</h1>
        </div>
        {
            friendRequests.length === 0 && (
                <div className='flex items-center justify-center w-full'>
                    <h1 className='text-xl dark:text-slate-200'>No request found</h1>
                </div>
            )
        }
        <div className='w-full grid p-1 md:grid-cols-4'>
        {
                  friendRequests.length !== 0 && (
                        friendRequests.map((f, i)=> {
                            return(
                                <Link to={`/profile/${f?.requestFrom?._id}`} key={f?._id} className='w-full p-2 flex flex-col border rounded gap-3 '>
                                            <div className='flex flex-col justify-between w-full'>
                                                <div className='flex flex-col justify-center gap-2 items-center w-full'>
                                                    <Avatarz height={150} width={150} name={(f?.requestFrom?.firstname + " " + f?.requestFrom?.lastname).toUpperCase()}/>
                                                    <p className='font-medium dark:text-slate-200'>{f?.requestFrom?.firstname + " " + f?.requestFrom?.lastname}</p>
                                                </div>
                                                <div className='flex text-xs w-full justify-center items-center'>
                                                    <p className=' dark:text-slate-400'>{calculateTime(f?.createdAt)}</p>
                                                </div>
                                            </div>
                                            
                                            <div className='flex gap-3 w-full justify-center items-center'>
                                                <button onClick={()=> acceptRequest(friendRequests?._id)} className='bg-green-600 rounded p-1 w-full text-white active:bg-green-300 font-semibold'>Confirm</button>
                                                <button onClick={()=> rejectRequest(friendRequests?._id)} className='bg-green-600 rounded w-full active:bg-green-300 p-1 text-white font-semibold'>Reject</button>
                                            </div>   
                                </Link>      
                                
                            )
                        })
                    )  
                }          
        </div>
        
    </div>
  )
}

export default AllRequests