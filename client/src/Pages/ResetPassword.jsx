import React, { useState } from 'react'
import Layout from '../Components/Layout'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const navigate = useNavigate()

    const { token } = useParams();


    const handleSubmit = async(e) => {
        e.preventDefault();
        if(confirm === newPassword) {
           
           const {data} = await axios.post(`/api/users/reset-password/${token}`, {newPassword}); 
           if(data.success) {
            toast.success(data.message);
             navigate("/")
             

           }
           if(!data.success) {
            toast.warn(data.message)
           }
        } else {
            toast.error("Password mismatch!")
        }
        
    
    }


  return (
        <div className=' dark:bg-facebookDark-200 h-screen flex justify-center items-center'>
            <div className=' w-[450px] h-[500px] border px-4 py-2'>
                <h2 className=' text-[24px] dark:text-slate-200 flex font-semibold justify-center'>RESET PASSWORD</h2>
                <form className='Sign-form' onSubmit={handleSubmit}>
                    <div className='ms'>
                        <label htmlFor='newPassword'>
                            <strong className='dark:text-slate-200'>New Password</strong>
                        </label>
                        <br />
                        <input className=' border rounded-md h-7 w-full px-2 dark:bg-slate-500 dark:text-white bg-slate-100' name='newPassword' value={newPassword}type='password' placeholder='input Password'id='newPassword' onChange={(e)=> setNewPassword(e.target.value)} />
                    </div>
                    <br />
                    <div className='ms'>
                        <label htmlFor='confirmNewPassword'>
                            <strong className='dark:text-slate-200'>Confirm New Password</strong>
                        </label>
                        <br />
                        <input className=' border h-7 dark:text-white w-full bg-slate-100 dark:bg-slate-500 rounded-md px-2' name='confirm' value={confirm} type='password' placeholder='input Password'id='confirmNewPassword' onChange={(e)=> setConfirm(e.target.value)} />
                    </div>
                    <br />
                    <div>
                        <button className=' bg-green-500 w-full text-slate-200 rounded-md p-2 font-semibold' type='submit'>RESET</button>
                    </div>
                </form>
                
            </div>

       </div>
  )
}

export default ResetPassword