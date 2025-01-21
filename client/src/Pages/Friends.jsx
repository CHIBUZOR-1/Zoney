import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Layout from '../Components/Layout';
import AllFriends from '../Components/AllFriends';
import AllRequests from '../Components/AllRequests';
import Suggestions from '../Components/Suggestions';

const Friends = () => {
  const location = useLocation();
  const [view, setView] = useState('');
  useEffect(()=> {
    const params = new URLSearchParams(location.search);
    const viewUrl = params.get('view');
    if(viewUrl) {
      setView(viewUrl);
    }
  }, [location.search]);

  return (
    <Layout>
      <div className='flex dark:bg-gray-800 max-sm:gap-4 max-sm:flex-col pt-10 min-h-screen mt-0 top-0'>
          <div className='bg-white max-md:max-w-[35%] dark:bg-gray-700 w-full max-w-[300px] max-sm:max-w-full max-sm:px-2 shadow-md border-t-0 h-full'>
            <aside className='flex h-screen max-sm:h-full max-sm:pb-2 flex-col pl-4 pt-9 max-sm:w-full gap-4'>
              <h1 className='font-semibold text-slate-700 text-2xl'>Friends</h1>
                <Link to={'/friends?view=requests'} style={{ textDecoration: 'none ', color: 'inherit'}} className='cursor-pointer hover:bg-slate-200 px-3 h-[40px] text-[20px] border'>
                    <p  className=' flex dark:text-slate-200 justify-between'> Friend Requests</p>
                </Link>
                <Link to={'/friends?view=suggestions'} style={{ textDecoration: 'none ', color: 'inherit'}} className='cursor-pointer  px-3 h-[40px] text-[20px] border'>
                    <p  className='hover:text-red-500 dark:text-slate-200 flex justify-between'>Suggestions</p>
                </Link>
                <Link to={'/friends?view=my_friends'} style={{ textDecoration: 'none ', color: 'inherit'}} className='cursor-pointer bg-gradient-to-r from-slate-600 to-slate-200 px-3 h-[40px] text-[20px] border'>
                    <p className='hover:text-red-500 dark:text-slate-200 text-white'>All Friends</p>
                </Link>
            </aside>
          
          </div>
          <main className='w-full'>
            {view === 'my_friends'? <AllFriends /> : <Outlet/>}
            {view === 'requests'? <AllRequests /> : <Outlet/>}
            {view === 'suggestions'? <Suggestions /> : <Outlet/>}
          </main>
        </div>
      </Layout>
  )
}

export default Friends