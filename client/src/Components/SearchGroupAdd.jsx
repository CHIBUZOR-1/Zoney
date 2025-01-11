import React, { useEffect, useState } from 'react'
import Avatar from './Avatar';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading'
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';

const SearchGroupAdd = ({onAddMember, showAdded}) => {
    const [loading, setLoading] = useState(false);
    const [phrase, setPhrase] = useState("");
    const [search, setSearch] = useState([]);
    useEffect(()=> {
        handleSearch()
      
    }, [phrase]);
  
    const handleSearch = async() => {
      try {
        setLoading(true)
        const {data} = await axios.post("/api/users/search", {phrase})
        setLoading(false)
        setSearch(data?.data)
      } catch (error) {
        toast.error(error?.data?.message)
      }
    }


  return (
    <div>
        <div  className='w-full dark:bg-slate-500 flex border px-1 mt-5 rounded-sm border-slate-400 justify-center items-center'>
            <input type="text" className='outline-none dark:text-slate-200 dark:bg-slate-500 p-2  w-full' value={phrase} onChange={(e)=> setPhrase(e.target.value)} placeholder='Search user by name' />
            <CiSearch className='text-[19px] dark:text-slate-100 cursor-pointer  font-semibold' />
        </div>
        <div className='mt-2'>
            {
              search.length === 0 && !loading && (
                <p className='text-center dark:text-slate-100 text-lg text-slate-400'>No user found!</p>
              )
            }
            {
              loading && (
                <div className='flex justify-center items-center pt-2'>
                  <ReactLoading type="spin" color='black' height={30} width={30}/>
                </div>
                
              )
            }
            {
              search.length !== 0 && !loading && (
                search.map((user, index) => {
                  return(
                    <Link key={user?._id} onClick={() => {onAddMember(user?._id); showAdded(user)}} className='flex hover:border rounded-md hover:border-green-600 items-center gap-3 p-2'>
                      <div>
                        <Avatar height={40} image={user?.profileImg} width={40} userId={user?._id} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""}/>
                      </div>
                      <div>
                        <div className='font-semibold dark:text-slate-200'>
                          {user?.firstname}
                        </div>
                        <p className='text-sm dark:text-slate-200'>{user?.email}</p>
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

export default SearchGroupAdd