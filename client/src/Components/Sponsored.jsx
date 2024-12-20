import React from 'react'

const Sponsored = ({ ads }) => {
  return (
    <div>
        <h2 className="font-bold mb-2">Sponsored</h2> 
        { 
            ads.map((ad, index) => ( 
                <div key={index} className="bg-gray-100 p-3 mb-3 rounded shadow"> 
                    <img src={ad.image} alt={ad.title} className="w-full h-auto mb-2"/> 
                    <p className="text-sm">{ad.description}</p> 
                </div> 
            ))
        }
    </div>
  )
}

export default Sponsored