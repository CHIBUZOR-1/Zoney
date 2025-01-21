import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GrStatusGood } from "react-icons/gr";
import { FiAlertTriangle } from "react-icons/fi";

const VerifyEmail = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        verifyUser();
    }, []);

    const verifyUser = async() => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/users/verify-email/${params.token}`)
            if(data.success) {
                setVerified(true)
                setLoading(false);
                setTimeout(() => {  
                    navigate('/')
                }, 3000);
                
            }
            if(!data.success) {
                setVerified(false)
                setMessage(data.message)
                setLoading(false)
                setTimeout(() => {  
                    navigate('/')
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
            setMessage("An Error Occured!")
            toast.error("An Error Occurred!")
            
        }
        
    }
  return (
    <div className='flex dark:bg-facebookDark-200 justify-center items-center'>
            <div>
                {
                    loading ? 
                    <div className='h-[100vh] animate-pulse flex justify-center items-center'>
                        <p className='text-[49px] dark:text-slate-200'>Please wait..</p>
                    </div> : 
                    <div>
                        {
                            verified ? 
                            <div className='h-[100vh] flex flex-col gap-2 justify-center items-center'>
                                <div className='flex flex-col gap-2 justify-center items-center'>
                                    <h2 className='text-[109px] text-green-500'><GrStatusGood /></h2>
                                    <p className='font-semibold dark:text-slate-200 text-[49px]'>Verified</p>
                                </div>
                                <div className='text-[20px] font-medium'>
                                    <p className='dark:text-slate-200'>Your Account Has Been Verified Successfully</p>
                                </div>
                                <div onClick={()=>{navigate('/'); window.scrollTo(0,0)}} className='bg-red-500 px-2 rounded-md'>
                                    <button className=' bg-red-500 font-medium text-white text-[17px]'>Continue</button>
                                </div>
                            </div> :
                            <div className='h-[100vh] flex flex-col gap-2 justify-center items-center'>
                                <div className='flex flex-col gap-2 justify-center items-center'>
                                    <h2 className='text-[109px] text-red-500'><FiAlertTriangle /></h2>
                                    <p className='font-semibold dark:text-slate-200 text-[29px]'>{message}</p>
                                </div>
                            </div>
                        }
                        </div>
                }
            </div>

    </div>
  )
}

export default VerifyEmail