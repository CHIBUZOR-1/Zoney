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
    const [mutualFrds, setMutualFrds] = useState([]);

    useEffect(()=> {
        fetchRequests()
    }, [user?.userId])

    const fetchRequests = async () => { 
        const res = await axios.get(`/api/requests/friend-requests`);
        setFriendRequests(res.data); 
        res.data.forEach(dt => {
            getMutualFriends(dt?.requestFrom?._id)
        })

    };
    console.log("mutualFrds", mutualFrds)
    const acceptRequest = async (requestId) => {
        try {
          const { data } = await axios.post('/api/requests/accept-request', { requestId });
          setFriendRequests(friendRequests.filter(request => request._id !== requestId));
        } catch (error) {
          console.error('Error accepting friend request:', error);
        }
      }
      
      const rejectRequest = async (requestId) => {
        try {
          const { data } = await axios.post('/api/requests/reject-request', { requestId });
          setFriendRequests(friendRequests.filter(request => request._id !== requestId));
        } catch (error) {
          console.error('Error rejecting friend request:', error);
        }
      }
      

    const getMutualFriends = async (id) => {
        const { data } = await axios.get(`/api/users/mutual-friends?userId2=${id}`);
        if(data.success) {
          setMutualFrds(prevState => ({ ...prevState, [id]: data.mutualFriends.length }));
        }
    }
    console.log("fr",friendRequests)


  return (
    <div className='pt-14 w-full overflow-hidden h-full flex flex-col gap-2 px-1'>
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
        <div className='w-full overflow-y-auto  gap-1 max-sm:grid-cols-2 max-md:grid-cols-2 grid p-2 md:grid-cols-3'>
        {
                  friendRequests.length !== 0 && (
                        friendRequests.map((f, i)=> {
                            return(
                                <div key={f?._id} className='w-full p-2 flex flex-col border rounded gap-3 '>
                                            <Link to={`/profile/${f?.requestFrom?._id}`} className='flex flex-col justify-between w-full'>
                                                <div className='flex max-[361px]:hidden flex-col justify-center gap-2 items-center w-full'>
                                                    <Avatarz height={150} width={150} image={f?.requestFrom?.profileImg} name={(f?.requestFrom?.firstname + " " + f?.requestFrom?.lastname).toUpperCase()}/>
                                                    <p className='font-medium dark:text-slate-200'>{f?.requestFrom?.firstname + " " + f?.requestFrom?.lastname}</p>
                                                </div>
                                                <div className='max-[361px]:flex min-[362px]:hidden flex-col justify-center gap-2 items-center w-full'>
                                                    <Avatarz height={120} width={120} image={f?.requestFrom?.profileImg} name={(f?.requestFrom?.firstname + " " + f?.requestFrom?.lastname).toUpperCase()}/>
                                                    <p className='font-medium dark:text-slate-200'>{f?.requestFrom?.firstname + " " + f?.requestFrom?.lastname}</p>
                                                </div>
                                                <div className='flex flex-col text-xs w-full justify-center items-center'>
                                                    <p className={` font-medium dark:text-slate-300`}>{mutualFrds[f?.requestFrom?._id] ? (mutualFrds[f.requestFrom._id] + " mutual friends")  : "No mutual friends"}</p>
                                                    <p className=' dark:text-slate-400'>{calculateTime(f?.createdAt)}</p>
                                                </div>
                                            </Link>
                                            
                                            <div className='flex gap-3 w-full justify-center items-center'>
                                                <button onClick={()=> acceptRequest(f?._id)} className='bg-green-600 max-sm:text-sm rounded p-1 w-full text-white active:bg-green-300 font-semibold'>Confirm</button>
                                                <button onClick={()=> rejectRequest(f?._id)} className='bg-green-600 max-sm:text-sm  rounded w-full active:bg-green-300 p-1 text-white font-semibold'>Reject</button>
                                            </div>   
                                </div>      
                                
                            )
                        })
                    )  
                }          
        </div>
        
    </div>
  )
}

export default AllRequests