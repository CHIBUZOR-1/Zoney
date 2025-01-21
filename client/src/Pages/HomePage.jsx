import React from 'react'
import Layout from '../Components/Layout'
import LeftSidePanel from '../Components/LeftSidePanel'
import RightSidePanel from '../Components/RightSidePanel'
import Feed from '../Components/Feed'


const HomePage = () => {
  return (
    <Layout>
        <div className='flex mb-0 ml-0 mr-0 p-0 w-full mt-14 gap-2'>
            <LeftSidePanel/>
            <Feed />
            <RightSidePanel/>
        </div> 
    </Layout>
    
  )
}

export default HomePage