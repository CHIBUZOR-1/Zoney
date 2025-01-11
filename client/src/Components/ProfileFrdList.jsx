import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Avatarz from './Avatar';
import { GoKebabHorizontal } from "react-icons/go";
import { formatNumber } from '../Client-Utils/CalculateTime';


const ProfileFrdList = () => {
    const [allFriends, setAllFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mutualFrds, setMutualFrds] = useState([]);

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

    const getMutualFriends = async (id) => {
        const { data } = await axios.get(`/api/users/mutual-friends?userId2=${id}`);
        if(data.success) {
          setMutualFrds(prevState => ({ ...prevState, [id]: data.mutualFriends.length }));
        }
    }


  return (
    <div className='w-full'>
        <div className='flex text-xl gap-2 items-center p-1'>
            <h2 className='font-semibold'>{formatNumber(allFriends.length)}</h2>
            <h2 className='font-semibold'>Friends</h2>
        </div>
        <div className='w-full'>
            {
                allFriends.length === 0 && !loading && (
                <div className='w-full h-[20%] p-2 flex items-center justify-center'>
                    <p className='dark:text-slate-400 font-medium text-2xl'>You have no friends yet</p>
                </div>
                )
            }
            <div className='w-full overflow-y-auto grid grid-cols-4  p-2'>
                {
                allFriends.length > 0 && !loading && (
                    allFriends.map((frd, i) => {
                    return(
                        <div key={frd?._id} className='rounded-md w-full flex items-center justify-between gap-2 border p-1'>
                            <div className='flex gap-2 items-center w-full'>
                               <Avatarz width={45} height={45} image={frd?.profileImg} name={(frd.firstname).toUpperCase()}/>
                                <div>
                                    <p className='md:text-sm font-semibold dark:text-slate-200'>{(frd.firstname + " "+ frd.lastname).toUpperCase()}</p>
                                    <p className={`${mutualFrds[frd._id] ? 'block' : "hidden"} font-medium dark:text-slate-300`}>{mutualFrds[frd._id]} mutual friends</p>
                                </div> 
                            </div>
                            <div className='flex items-center'>
                                <button className='p-1'><GoKebabHorizontal className=''/></button>
                            </div>
                        </div>
                    )
                    })
                )
                }
            </div>
        </div>
    </div>
  )
}

export default ProfileFrdList