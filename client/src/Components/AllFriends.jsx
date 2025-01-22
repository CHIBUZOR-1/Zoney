import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ReactLoading from 'react-loading'
import { useTheme } from '../Context/ThemeContext';
import { formatNumber } from '../Client-Utils/CalculateTime';
import Avatarz from './Avatar';

const AllFriends = () => {
  const [allFriends, setAllFriends] = useState([]);
  const [mutualFrds, setMutualFrds] = useState([])
  const [loading, setLoading] = useState(false);
  const {theme} = useTheme();
  useEffect(()=> {
    getAllFriends()
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
    <div className='pt-14 w-full h-full'>
        <div className='w-full p-1'>
            <h1 className='dark:text-slate-200 text-xl font-semibold'>All Friends ({formatNumber(allFriends.length)})</h1>
        </div>
        <div className='w-full'>
          {
            loading && (
              <div className='flex justify-center items-center pt-2'>
                {
                  theme === "dark" ? (
                    <ReactLoading type="spin" color='white' height={30} width={30}/>
                  ) : (
                    <ReactLoading type="spin" color='black' height={30} width={30}/>
                  )
                }
                  
              </div>
            )
          }
          {
            allFriends.length === 0 && !loading && (
              <div className='w-full h-[20%] flex items-center justify-center'>
                <p className='dark:text-slate-400 font-medium text-2xl'>You have no friends yet</p>
              </div>
            )
          }
          <div className='w-full scrollbar max-sm:grid-cols-2 max-md:grid-cols-3 overflow-y-auto grid grid-cols-4 gap-1 p-2'>
            {
              allFriends.length > 0 && !loading && (
                allFriends.map((frd, i) => {
                  return(
                      <div key={frd?._id} className='rounded-md border-slate-400 dark:border-slate-400 flex flex-col items-center justify-center border p-1'>
                        <div className='max-md:hidden'>
                          <Avatarz width={150} height={150} image={frd?.profileImg} name={(frd.firstname).toUpperCase()}/>
                        </div>
                        <div className='md:hidden'>
                          <Avatarz width={120} height={120} image={frd?.profileImg} name={(frd.firstname).toUpperCase()}/>
                        </div>
                        <div className='flex w-full flex-col items-center justify-center'>
                          <p className='md:text-sm font-semibold dark:text-slate-200'>{(frd.firstname + " "+ frd.lastname).toUpperCase()}</p>
                         <p className={` text-sm text-slate-500 font-medium dark:text-slate-300`}>{mutualFrds[frd?._id] ? (mutualFrds[frd?._id] + " mutual friends")  : "No mutual friends"}</p>
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

export default AllFriends