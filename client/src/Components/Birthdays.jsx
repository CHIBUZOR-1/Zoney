import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaGift } from "react-icons/fa6";

const Birthdays = () => {
  const [birthdays, setBirthdays] = useState([]);
  useEffect(()=> {
    getBirthdays();
  }, []);
  const getBirthdays = async()=> {
    const { data } = await axios.get('/api/requests/birthdays');
    if(data?.success) {
      setBirthdays(data?.friendsWithBirthdayToday);
    }
  }
  const lastBirthday = birthdays[birthdays.length -1];


  return (
    <div className='w-full p-2'>
        <hr />
        <h2 className='text-slate-400 font-semibold'>Birthdays</h2>
        {
          birthdays.length === 0 && (
            <div className='w-full flex items-center justify-center p-1'>
              <p className='dark:text-slate-200 font-semibold text-sm'>No birthdays</p>
            </div>
          )
        }
        {
          birthdays.length === 1 && (
            <div className='w-full flex items-center justify-center p-1'>
              <p className='text-sm dark:text-white'><span className='font-semibold dark:text-white'>{lastBirthday?.firstname + " " + lastBirthday?.lastname}</span> have birthday today</p>
            </div>
          )
        }
        {
          birthdays.length > 1 && (
            <div className='flex gap-2 p-2 w-full'>
              <FaGift className='text-blue-600 text-[24px]' />
              <p className='text-sm dark:text-white'><span className='font-semibold dark:text-white'>{lastBirthday?.firstname + " " + lastBirthday?.lastname}</span> and <span className='font-semibold'>{birthdays.length - 1}</span> others have birthdays today.</p>
            </div>
          )
        }
    </div>
  )
}

export default Birthdays