import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import MutualFriendsCount from './MutualFriendsCount';
import Avatarz from './Avatar';

const Suggestions = () => {
    const [users, setUsers] = useState([]);
    useEffect(()=> {
        fetchUsers();
    }, []);
    const fetchUsers = async () => { 
        const {data} = await axios.get(`/api/users/suggestions`);
        if(data.success) {
           setUsers(data.suggestedUsers);  
        }
    };
    
    const sendRequest = async(id)=> {
      const {data}= await axios.post('/api/requests/send-request', { recipientId: id });
      if(data.success) {
        toast.success("Friend request sent")
      }
    }
    console.log(users)
  return (
    <div className='h-full overflow-y-auto scrollbar pt-14 pb-2 max-sm:pb-1 w-full'>
      <div className='w-full p-1 pl-1'>
        <h1 className='dark:text-slate-200 text-xl font-semibold'>Suggestions</h1>
      </div>
      <div className={` ${users.length ?'grid md:grid-cols-3  max-md:grid-cols-2 max-sm:grid-cols-2' : ""} gap-2 h-full px-2`}>
          {
            users.length === 0 && (
              <div className='h-full w-full  flex justify-center items-center'>
                <p className='text-2xl text-slate-700'>No users Found!</p>
              </div>
            )
          }
          {
            users.length !== 0 && (
              users.map((u, i)=> {
                return(
                  <div key={i} className=' h-fit  gap-2 flex w-full flex-col items-center p-1 justify-center border rounded '>
                    <div className='w-full md:hidden flex items-center justify-center'>
                      <Avatarz width={105} height={105} image={u?.profileImg} />
                    </div>
                    <div className='w-full max-md:hidden flex items-center justify-center'>
                      <Avatarz width={135} height={135} image={u?.profileImg} />
                    </div>
                    <div className='w-full flex items-center  flex-col justify-center'>
                      <p className='dark:text-slate-200 max-sm:text-[15px] font-semibold'>{(u?.firstname + " " + u?.lastname).toUpperCase()}</p>
                      <MutualFriendsCount userId2={u?._id}/>
                    </div>
                    <div className='w-full items-center flex justify-center'>
                      <button onClick={()=> sendRequest(u?._id)} className='w-[60%] max-sm:text-xs text-slate-100 font-semibold max-md:text-sm bg-green-500 p-1 rounded-md'>Add Friend</button>
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

export default Suggestions