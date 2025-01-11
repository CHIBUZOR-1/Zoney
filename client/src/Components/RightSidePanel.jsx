import React from 'react'
import Sponsored from './Sponsored'
import FriendRequests from './FriendRequests'
import Birthdays from './Birthdays'
import Contacts from './Contacts'

const RightSidePanel = () => {
  return (
    <div className='h-full gap-3 max-sm:hidden overflow-y-auto w-[25%] max-md:w-[30%] p-2 fixed right-0  transform transition-transform duration-200 ease-in-out translate-x-0 flex flex-col z-50 sm:z-0'>
        <Sponsored ads={['']} />
        <FriendRequests />
        <Birthdays /> 
        <hr />
        <Contacts />
    </div>
  )
}

export default RightSidePanel