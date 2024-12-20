import React from 'react'
import Sponsored from './Sponsored'
import FriendRequests from './FriendRequests'
import Birthdays from './Birthdays'

const RightSidePanel = () => {
  return (
    <div className='h-full gap-3 max-sm:hidden overflow-y-auto w-[25%] p-2 fixed right-0 max-md:w-40 transform transition-transform duration-200 ease-in-out translate-x-0 flex flex-col z-50 sm:z-0'>
        <Sponsored ads={['']} />
        <FriendRequests />
        <Birthdays /> 
        <hr />
        <div className="mb-4">Contacts</div>
    </div>
  )
}

export default RightSidePanel