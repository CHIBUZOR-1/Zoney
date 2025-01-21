import React, { useEffect, useState } from 'react'
import { formatNumber } from '../Client-Utils/CalculateTime';
import axios from 'axios';

const MutualFriendsCount = ({userId2}) => {
    const [mutualFrds, setMutualFrds] = useState([]);
    useEffect(()=>{
        mutualFriends();
    },[]);
    const mutualFriends = async()=> {
        const {data} = await axios.get(`/api/users/mutual-friends?userId2=${userId2}`);
        if(data.success) {
          setMutualFrds(data.mutualFriends);
        }
    }
        
  return (
    <div className={`flex justify-center gap-1 w-full`}>
        <p className='text-xs dark:text-slate-200 flex'>{mutualFrds?.length? formatNumber(mutualFrds.length).toString() + " " : "No"}</p>
        <p className='text-xs dark:text-slate-200 flex'>mutual friends</p>
    </div>
  )
}

export default MutualFriendsCount