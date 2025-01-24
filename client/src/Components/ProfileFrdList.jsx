import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Avatarz from './Avatar';
import { GoKebabHorizontal } from "react-icons/go";
import { formatNumber } from '../Client-Utils/CalculateTime';


const ProfileFrdList = () => {
    const [allFriends, setAllFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mutualFrds, setMutualFrds] = useState([]);
    const [lstmenu, setLstmenu] = useState(null);

    useEffect(()=> {
        getAllFriends();
    }, [])

    const getAllFriends = async () => {
        setLoading(true)
        const { data } = await axios.get('/api/users/all-friends');
        if(data.success) {
          setAllFriends(data.friends);
          setLoading(false);
          // Fetch mutual friends for each friend
          data.friends.forEach(friend => { 
            getMutualFriends(friend._id); 
          });
        }
    }

    const unfriendUser = async (friendId)=> {
        const { data } = await axios.post('/api/requests/unfriend', {friendId});
        if(data?.success) {
            setAllFriends(allFriends.filter(frds => frds._id !== friendId))
        }
    }

    const getMutualFriends = async (id) => {
        const { data } = await axios.get(`/api/users/mutual-friends?userId2=${id}`);
        if(data.success) {
          setMutualFrds(prevState => ({ ...prevState, [id]: data.mutualFriends.length }));
        }
    } 

    const dropMenu = (friendId)=> {
        setLstmenu(prev => prev === friendId ? null : friendId);
    }


  return (
    <div className='w-full overflow-hidden'>
        <div className='flex w-full h-fit text-xl gap-2 items-center p-1'>
            <h2 className='font-semibold'>{formatNumber(allFriends.length)}</h2>
            <h2 className='font-semibold'>Friends</h2>
        </div>
        <div className='w-full overflow-y-auto'>
            {
                allFriends.length === 0 && !loading && (
                <div className='w-full h-[20%] p-2 flex items-center justify-center'>
                    <p className='dark:text-slate-400 font-medium text-2xl'>You have no friends yet</p>
                </div>
                )
            }
            
            {
                allFriends.length > 0 && !loading && (
                    <div className='w-full  max-[400px]:grid-cols-1 gap-1 max-sm:grid-cols-1 grid grid-cols-4  p-2'>
                        {allFriends.map((frd, i) => {
                        return(
                            <div key={frd?._id} className='rounded-md relative h-fit w-full flex border-slate-300 items-center justify-between gap-2 border p-1'>
                                <div className='flex gap-2 items-center w-full'>
                                <Avatarz width={45} height={45} image={frd?.profileImg} name={(frd.firstname).toUpperCase()}/>
                                    <div>
                                        <p className='md:text-sm max-sm:text-sm font-semibold dark:text-slate-200'>{(frd.firstname + " "+ frd.lastname).toUpperCase()}</p>
                                        <p className={` font-medium text-xs  dark:text-slate-300`}>{mutualFrds[frd._id] ? (mutualFrds[frd._id] + " mutual friends")  : "No mutual friends"}</p>
                                    </div> 
                                </div>
                                <div className='flex items-center'>
                                    <button onClick={()=> dropMenu(frd?._id)} className='p-1'><GoKebabHorizontal className=''/></button>
                                    
                                </div>
                                {lstmenu === frd?._id && (
                                        <div className='absolute flex justify-center right-0 items-center p-1 z-50 rounded-md -bottom-[28px] w-36 bg-slate-600'>
                                            <button onClick={()=> unfriendUser(frd?._id)} className='p-1 w-full dark:bg-facebookDark-600 font-semibold rounded-md bg-slate-300'>Unfriend</button>
                                        </div>
                                )}
                            </div>
                        )
                    })}
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default ProfileFrdList