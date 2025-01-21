import React, { useState } from 'react'
import ReactLoading from 'react-loading'
import { assets } from '../Components/Assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
    const {data} = await axios.post('/api/users/forgot-password', {email});
    if(data.success) {
        toast.success(data.message)
        setEmail("")
        setLoading(false)
    } else {
        toast.error('Email not valid!')
        setLoading(false)
    }
  }
 // h-[200px] max-[480px]:h-full

  return (
      <div className=' dark:bg-facebookDark-200 flex h-screen overflow-hidden max-[480px]:px-2 flex-col justify-center gap-3 items-center'>
            <div className='flex justify-center max-lg:w-36 items-center rounded border h-24 w-24'>
               <img src={assets.z} className='h-full w-full' alt="" /> 
            </div>
            
            <div className=' w-[450px] flex flex-col items-center max-[480px]:w-full border max-[480px]:px-1 rounded px-4 py-2'>
                <h2 className=' text-[24px] dark:text-slate-200 max-[480px]:text-[15px] flex font-semibold justify-center'>FORGOT PASSWORD?</h2>
                <p className='max-[480px]:text-[11px] dark:text-slate-200'>Enter the email address associated with your account.</p>
                <form className=' w-full' onSubmit={handleSubmit}>
                    <div className='ms'>
                        <label htmlFor='newPassword'>
                            <strong className='max-[480px]:text-[12px] dark:text-slate-200'>Email</strong>
                        </label>
                        <br />
                        <input className=' border max-sm:text-sm rounded-md h-7 w-full px-2 dark:bg-slate-300 bg-slate-100' name='Email' value={email} type='text' required placeholder='input email here' id='email' onChange={(e)=> setEmail(e.target.value)} />
                    </div>
                    <br />
                    <div>
                        <button disabled={!email} className={`${!email? "bg-slate-300":"bg-slate-600"} w-full cursor-pointer  text-white rounded-md h-8`} type='submit'>{loading ? <div className='w-full   flex items-center justify-center h-full'><ReactLoading type="spin" color='white' height={15} width={15}/></div> : "Continue"}</button>
                    </div>
                </form>
                
            </div>

      </div>
  )
}

export default ForgotPasswordPage