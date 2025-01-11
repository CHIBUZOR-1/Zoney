import React from 'react'

const TabNav = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="border-b grid grid-cols-4 w-full border-gray-200">
        { 
            tabs.map((tab, index) => ( 
                <button key={index} className={`px-4 py-2 dark:bg-slate-800 dark:text-slate-200 -mb-px font-semibold text-gray-700 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`} onClick={() => onTabClick(tab)} > {tab} </button> 
                )
            )
        }
    </div>
  )
}

export default TabNav