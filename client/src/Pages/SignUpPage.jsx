import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading'
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../Client-Utils/Firebase';

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    birthdate: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  console.log(info)
  console.log(new Date().getFullYear());

  const handleChange = (e)=> {
    setInfo({ ...info, [e.target.name]: e.target.value });

  }

  const handleGoogleOauth = async() => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account'})
    try {
      const oauthResults = await signInWithPopup(auth, provider)
      console.log(oauthResults)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setLoading(true)
      if(info.confirmPassword === info.password) {
        const birthdate = new Date(info.birthdate);
        const age = new Date().getFullYear() - birthdate.getFullYear();
        const { data } = await axios.post('/api/users/register', { ...info, age});
        if(data.success) {
          toast.success(data.message);
          setInfo({
            firstname: "",
            lastname: "",
            username: "",
            email: "",
            phone: "",
            gender: "",
            birthdate: "",
            password: "",
            confirmPassword: ""
          })
          setLoading(false)
          navigate("/")
        }
        if(!data.success) {
          toast.warn(data.message)
          setLoading(false)
        }
      
    } 
    
    
  }

  return (
    <div className='flex items-center flex-col gap-3 pt-5 px-2 justify-center'>
      <div className='flex items-center w-28 rounded-md bg-green-700 px-2 justify-center'>
        <h2 className='text-white font-bold text-2xl'>ZONEY</h2>
      </div>
      <form onSubmit={handleSubmit} className='gap-6 border h-full max-sm:text-sm border-slate-400 rounded-md p-2 w-[70%] mx-auto '>
        <div className='flex space-x-2 justify-center items-center'>
          <div className='flex w-full flex-col'>
            <p>Firstname</p>
            <input name='firstname' id='firstname' value={info.firstname} onChange={handleChange} className='w-full outline-green-400 p-1 border rounded-md' type="text" placeholder='input Firtname' />
          </div>
          <div className='flex w-full flex-col'>
            <p>Lastname</p>
            <input name='lastname' value={info.lastname} onChange={handleChange} className='w-full p-1 outline-green-400 border rounded-md' type="text" placeholder='input Lastname' />
          </div>
        </div>
        <div className='flex space-x-2 justify-center items-center'>
          <div className='flex w-full flex-col'>
            <p>Username</p>
            <input name='username' value={info.username} onChange={handleChange} className='w-full outline-green-400 p-1 border rounded-md' type="text" placeholder='input username' />
          </div>
          <div className='flex w-full flex-col'>
            <p>email</p>
            <input name='email' value={info.email} onChange={handleChange} className='w-full p-1 outline-green-400 border rounded-md' type="email" placeholder='input email' />
          </div>
        </div>
        <div className='flex space-x-2 justify-center items-center'>
          <div className='flex w-full flex-col'>
            <p>Phone</p>
            <input name='phone' value={info.phone} onChange={handleChange} className='w-full outline-green-400 p-1 border rounded-md' type="text" placeholder='input username' />
          </div>
          <div className='flex w-full flex-col'>
            <p>Gender:</p>
            <select name="gender" id="gender" value={info.gender} onChange={handleChange} className='w-full outline-green-400 p-1 border rounded-md'>
              <option className={`${info.gender? 'hidden': 'block'}`} value="">-select-</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className='flex space-x-2 justify-center items-center'>
          <div className='flex w-full flex-col'>
           <p>Date of Birth</p>
           <input type="date" value={info.birthdate} name="birthdate" className='w-full outline-green-400 p-1 border rounded-md' onChange={handleChange} required /> 
          </div>
        </div>
        <div className='flex max-sm:flex-col space-x-2 justify-center items-center'>
          <div className='flex w-full flex-col'>
            <p>Password</p>
            <input name='password' id='password' value={info.password} onChange={handleChange} className='w-full outline-green-400 p-1 border rounded-md' type="password" placeholder='input Firtname' />
          </div>
          <div className='flex w-full flex-col'>
            <p>Confirm Password</p>
            <input name='confirmPassword' value={info.confirmPassword} onChange={handleChange} className='w-full p-1 outline-green-400 border rounded-md' type="password" placeholder='input Lastname' />
          </div>
        </div>
        <div className='flex w-full justify-center max-[400px]:text-[12px] max-[500px]:text-[14px] items-center space-x-2 px-1'>
          <p>Already have an account?</p>
          <p onClick={()=>navigate('/')} className='text-blue-500 cursor-pointer'>Sign In</p>
        </div>
        <div className='w-full mt-2 flex justify-center items-center'>
          <button type='submit' className='w-[50%] active:bg-slate-800 bg-purple-700 text-white border-slate-700 border rounded-md font-semibold'>{loading ? <div className='w-full   flex items-center justify-center h-full'><ReactLoading type="spin" color='white' height={15} width={15}/></div> : "Register"}</button>
        </div>
      </form>
      <div className='items-center max-sm:text-sm w-[50%] flex-col flex justify-center'>
        <div className='flex items-center w-full justify-center gap-1'>
          <hr  className='w-[700px] max-sm:w-40 border-slate-300'/>
          <p>or</p>
          <hr  className='w-[700px] max-sm:w-40 border-slate-300'/>
        </div>
        <button onClick={handleGoogleOauth} className='flex border-[2px] max-sm:w-full border-green-800 w-[50%] p-1 rounded gap-2 items-center justify-center'>
          <FcGoogle />
          <p className='font-semibold max-sm:text-xs'>Sign up with Google</p>
        </button>
        
      </div>
    </div>
  )
}

export default SignUpPage