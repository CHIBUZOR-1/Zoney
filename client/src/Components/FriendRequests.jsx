import React, { useEffect, useState } from 'react'
import Avatarz from './Avatar'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MutualFriendsCount from './MutualFriendsCount';
import moment from 'moment'

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
    const acceptRequest = async(requestId) => {
        const {data} = await axios.post('/api/requests/accept-request', { requestId })
    }
    const rejectRequest = async(requestId) => {
        const {data} = await axios.post('/api/requests//reject-request', { requestId })
    }
    const lastRequest = friendRequests[friendRequests.length -1];


  return (
    <div className={`flex w-full gap-1 flex-col ${!friendRequests.length ? "hidden": "block"}`}>
        <hr />
        <div className='flex items-center justify-between'>
            <h3 className='dark:text-white'>Friend requests</h3>
            <Link to={"/friends"} className='text-xs text-blue-500 cursor-pointer'>See all</Link>
        </div>
        {
            lastRequest && (
                <div className='w-full flex flex-col gap-3'>
                        <div className='flex justify-between w-full'>
                            <div className='flex gap-2 items-center w-fit'>
                                <Avatarz height={35} width={35} name={(lastRequest?.requestFrom?.firstname + " " + lastRequest?.requestFrom?.lastname).toUpperCase()}/>
                                <div className='flex flex-col items-center w-full'>
                                    <p className='max-md:text-xs font-medium text-[14px] dark:text-white'>{(lastRequest?.requestFrom?.firstname + " " + lastRequest?.requestFrom?.lastname).toUpperCase()}</p>
                                    <MutualFriendsCount userId2={lastRequest?.requestFrom?._id}/>
                                </div>
                            </div>
                            <div className='flex text-xs w-fit pt-1'>
                                <p className='ml-auto max-md:text-xs dark:text-white'>{moment(lastRequest?.createdAt).format('LT')}</p>
                            </div>
                        </div>
                        <div className='flex gap-3 w-full justify-center items-center'>
                            <button onClick={()=> acceptRequest(lastRequest?._id)} className='bg-green-600 rounded max-md:text-sm p-1 text-white active:bg-green-300 font-semibold'>Confirm</button>
                            <button onClick={()=> rejectRequest(lastRequest?._id)} className='bg-green-600 rounded max-md:text-sm p-1 text-white active:bg-green-300 font-semibold'>Reject</button>
                        </div>   
                    </div>
            )
            
        }
    </div>
  )
}

export default FriendRequests