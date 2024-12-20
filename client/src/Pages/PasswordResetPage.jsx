import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const navigate = useNavigate()

  const { token } = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
  }

  return (
    <div className='h-[100vh] flex justify-center items-center'>
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
                    <button className=' bg-green-600 w-full font-semibold text-white rounded-md h-8' type='submit'>RESET</button>
                </div>
            </form>
            
        </div>

    </div>
  )
}

export default PasswordResetPage