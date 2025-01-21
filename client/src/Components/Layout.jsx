import React from 'react'

import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Helmet from 'react-helmet'

const Layout = ({children, title, description}) => {
  return (
    <div className='flex flex-col p-0 w-full m-0 dark:bg-facebookDark-100'>
      <Helmet>
        <meta charset="UTF-8"/>
        <meta name="author" content="AMAECHI HENRY CHIBUZOR"/>
        <meta name="description" content={description}/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="robots" content="index, follow"/>
        <title>{title}</title>
      </Helmet>
      <Navbar />
      <main className='bg-slate-200 min-h-screen m-0 dark:bg-facebookDark-100 '>
        {children}
      </main>
    </div>
  )
}

export default Layout