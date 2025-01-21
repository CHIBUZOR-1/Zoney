import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Avatarz from './Avatar';
import { Link } from 'react-router-dom';

const Contacts = () => {
    const [allContacts, setAllContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        getAllContacts();
    }, [])


    const getAllContacts = async () => {
        setLoading(true)
        const { data } = await axios.get('/api/users/all-friends');
        if(data.success) {
          setAllContacts(data.friends);
          setLoading(false);
      }
    }
  return (
    <div className="mb-4 w-full p-1 flex flex-col gap-2 dark:text-white">
        <div className='p-2 w-full items-center'>
            <h2 className='text-xl font-semibold'>Contacts</h2>
        </div>
        {
            loading && (
                Array.from({ length: 5 }).map((ac, i)=> {
                    return(
                        <div key={i} className='flex items-center gap-1'>
                            <div className='w-11 h-11 animate-pulse bg-slate-600 dark:bg-slate-400 rounded-full'></div>
                            <p className='h-6 w-[80%] animate-pulse rounded bg-slate-600 dark:bg-slate-400'></p>
                        </div>
                    )
                })
            )
        }
        {
            !loading && allContacts.length === 0 && (
                <div className='flex items-center justify-center'>
                    <p className='font-semibold text-slate-600 dark:text-slate-200'>No contacts</p>
                </div>
            )
        }
        {
            !loading && allContacts.length > 0 && (
                allContacts.map((ac, i)=> {
                    return(
                        <Link to={`/messages/${ac?._id}`} key={ac?._id} className='flex items-center pr-3 gap-2'>
                            <Avatarz id={ac?._id} height={55} name={(ac?.firstname + " " + ac?.lastname).toUpperCase()} width={55} image={ac.profileImg}/>
                            <p className='dark:text-slate-200'>{ac?.firstname + " " + ac?.lastname}</p>
                        </Link>
                    )
                })
            )
        }
    </div>
  )
}

export default Contacts