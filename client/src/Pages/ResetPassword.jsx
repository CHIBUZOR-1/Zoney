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
             navigate("/")
             toast.success(data.message)

           }
           if(!data.success) {
            toast.warn(data.message)
           }
        } else {
            toast.error("Password mismatch!")
        }
        
    
    }


  return (
    <Layout>
        <div className=' flex justify-center items-center'>
            <div className=' w-[450px] h-[500px] border px-4 py-2'>
                <h2 className=' text-[24px] flex font-semibold justify-center'>RESET PASSWORD</h2>
                <form className='Sign-form' onSubmit={handleSubmit}>
                    <div className='ms'>
                        <label htmlFor='newPassword'>
                            <strong>New Password</strong>
                        </label>
                        <br />
                        <input className=' border rounded-md h-7 w-full px-2 bg-slate-100' name='newPassword' value={newPassword}type='password' placeholder='input Password'id='newPassword' onChange={(e)=> setNewPassword(e.target.value)} />
                    </div>
                    <br />
                    <div className='ms'>
                        <label htmlFor='confirmNewPassword'>
                            <strong>Confirm New Password</strong>
                        </label>
                        <br />
                        <input className=' border h-7 w-full bg-slate-100 rounded-md px-2' name='confirm' value={confirm} type='password' placeholder='input Password'id='confirmNewPassword' onChange={(e)=> setConfirm(e.target.value)} />
                    </div>
                    <br />
                    <div>
                        <button className=' bg-slate-600 w-full text-white rounded-md h-8' type='submit'>RESET</button>
                    </div>
                </form>
                
            </div>

       </div>
    </Layout>
  )
}

export default ResetPassword