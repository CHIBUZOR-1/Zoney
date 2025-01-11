import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {setUser} from '../State/UserSlice';
import axios from 'axios';
import ReactLoading from 'react-loading'
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../Client-Utils/Firebase';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    email: "",
    password: ""
  });

  const handleGoogleLogin = async() => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account'})
    try {
      const oauthResults = await signInWithPopup(auth, provider)
      console.log(oauthResults)
      const userData = { 
        email: oauthResults.user.email,
        googleId: oauthResults.user.uid
      };
      const{ data } = await axios.post('/api/users/googleAuthLogin', userData);
      if(data.success) {
        toast.success(data.message);
        dispatch(setUser(data.details));
        navigate('/home');
      }
    } catch (error) {
      console.log(error)
    }
  }

  
  
  const handleChange = (e)=> {
    setInfo({ ...info, [e.target.name]: e.target.value });

  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)
    const response = await axios.post('/api/users/login', info);
    if(response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.details));
        setLoading(false)
        navigate('/home');
    } 
        
    if(!response.data.success) {
      setLoading(false)
      toast.error(response.data.message);
        
    }
  }

  return (
    <div className='flex pb-5 w-full m-0 dark:bg-facebookDark-100 items-center h-screen flex-col gap-4 pt-5 px-2 justify-center'>
      <div className='flex items-center w-28 rounded-md bg-green-700 px-2 justify-center'>
        <h2 className='text-white font-bold text-2xl'>ZONEY</h2>
      </div>
      <form onSubmit={handleSubmit} className='gap-4 border max-sm:w-full border-slate-400 pt-7 pb-4 rounded-md p-2 md:w-[50%] mx-auto '>
        <div className='flex flex-col space-y-5 justify-center items-center'>
          <div className='flex w-full'>
            <input name='email' id='email' value={info.email} onChange={handleChange} className='w-full outline-green-400 dark:bg-facebookDark-800 dark:text-slate-50 p-1 border rounded-md' type="email" placeholder='input email' />
          </div>
          <div className='flex w-full'>
            <input  name='password' value={info.password} onChange={handleChange} className='w-full dark:bg-facebookDark-800 dark:text-slate-50 p-1 outline-green-400 border rounded-md' type="password" placeholder='input password' />
          </div>
        </div>
        <div className='text-blue-500 mt-1 w-full max-[500px]:text-sm flex '>
          <p onClick={()=>navigate('/forgot-password')} className='ml-auto max-sm:text-xs cursor-pointer'>Forgot Password?</p>
        </div>
        <div className='flex mt-6 w-full justify-center max-[400px]:text-[12px] max-[500px]:text-[14px] items-center space-x-2 px-1'>
          <p className='dark:text-slate-200'>Don't have an account?</p>
          <p onClick={()=>navigate('/signup')} className='text-blue-500 dark:text-blue-400 max-sm:text-xs cursor-pointer'>Sign Up</p>
        </div>
        <div className='w-full mt-6 flex flex-col gap-2 justify-center items-center'>
          <button type='submit' className='w-[50%] flex justify-center items-center active:bg-slate-800 bg-purple-700 text-white border-slate-700 border rounded-md font-semibold'>{loading ? <ReactLoading type="spin" className='flex items-center justify-center' color='white' height={30} width={15}/> : "Login"}</button>
        </div>
      </form>
      <div className=' w-[70%] flex items-center justify-center'>
        <button onClick={handleGoogleLogin} className='flex border-[2px] max-sm:w-full border-green-800 w-[50%] p-1 rounded gap-2 items-center justify-center'>
          <FcGoogle />
          <p className='font-semibold dark:text-slate-200 max-sm:text-xs'>Continue with Google</p>
        </button>
      </div>
    </div>
  )
}

export default LoginPage