import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import MutualFriendsCount from './MutualFriendsCount';

const Suggestions = () => {
    const [users, setUsers] = useState([]);
    const avt = "https://th.bing.com/th/id/R.b30698316012f1c7dbc8c28b122409d9?rik=HL6r08WdgQwOfg&riu=http%3a%2f%2fwww.atexdb.eu%2fimages%2fno_user.png&ehk=9bryxZZYVhvUsh48uKM2YjcE1JUACaxSsu3rxDPGxqU%3d&risl=&pid=ImgRaw&r=0"
    useEffect(()=> {
        fetchUsers();
    }, []);
    const fetchUsers = async () => { 
        const {data} = await axios.get(`/api/users/suggestions`);
        if(data.success) {
           setUsers(data.users);  
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
    <div className={`pt-5 ${users.length ?'grid md:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-2' : ""}  gap-2 h-full px-3`}>
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
                <div className='  gap-2 h-96 max-sm:h-72 flex flex-col items-center justify-center border rounded '>
                  <div className='bg-slate-300 rounded max-sm:h-[75%] h-[80%] w-full'>
                    <img src={u?.profilePic || avt} className='w-full h-full bg-slate-600' alt="" />
                  </div>
                  <div className='w-full flex justify-center'>
                    <p className='dark:text-slate-200 font-semibold'>{(u?.firstname + " " + u?.lastname).toUpperCase()}</p>
                    <MutualFriendsCount userId2={u?._id}/>
                  </div>
                  <div className='w-full items-center mb-1 flex justify-center'>
                    <button onClick={()=> sendRequest(u?._id)} className='w-[60%] max-md:text-sm bg-slate-300 p-2 rounded'>Add Friend</button>
                  </div>
                </div>
              )
            })
          )
        }
    </div>
  )
}

export default Suggestions