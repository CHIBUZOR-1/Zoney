import React, { useEffect, useRef, useState } from 'react'
import { FaCamera } from "react-icons/fa";
import Avatarz from '../Components/Avatar';
import Layout from '../Components/Layout'
import TabNav from '../Components/TabNav';
import TabContent from '../Components/TabContent';
import { useDispatch, useSelector } from 'react-redux';
import { LuPenLine } from "react-icons/lu";
import { Modal } from 'antd';
import UserDetails from '../Components/UserDetails';
import axios from 'axios';
import Postz from '../Components/Postz';
import Photos from '../Components/Photos';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiUserAdd } from "react-icons/hi";
import AboutProfileView from '../Components/AboutProfileView';
import { updateCoverPhoto, updateProfilePic, updateProfilez } from '../State/UserSlice';
import moment from 'moment';
import ProfileFrdList from '../Components/ProfileFrdList';
import FullViewPost from '../Components/FullViewPost';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import ReactLoading from 'react-loading'
import { formatNumber } from '../Client-Utils/CalculateTime';


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts'); 
  const dispatch  = useDispatch();
  const [detailz, setDetails] = useState({});
  const location = useLocation();
  const params = useParams();
  const user = useSelector(state => state?.user?.user);
  const [imgUrl, setImgUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [incomingRequestDrp, setIncomingRequestDrp] = useState(false);
  const [detailzLoad, setDetailzLoad] = useState(false);
  const [selectImg, setSelectImg] = useState(null);
  const [aboutz, updateAboutz]= useState({
    bio: '',
    city: '',
    country: '',
    worksAt: '',
    education: ''
  });
  const [newDetails, setNewDetails] = useState({ 
    newFirstname: '', 
    newLastname: '', 
    newBirthdate: '', 
    newGender: '' 
  });
  const [requestz, setRequests] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const videoRef =useRef(null)
  const [img, setImg] = useState(null); 
  const [coverImgz , setCoverImg] = useState(null);
  let [stream, setStream] = useState(null);
  const [hide, setHide] = useState(false)
  const [abtLoader, setAbtLoader] = useState(false);
  const [profLoader, setProfLoader] = useState(false)
  const [selectedPost1, setSelectedPost1] = useState(null);
  const [acpRqtLoad, setAcpRqtLoad] = useState(false);
  const [rjtRqtLoad, setRjtRqtLoad] = useState(false);
  const [cncRqtLoad, setCncRqtLoad] =  useState(false);
  const [addLoad, setAddLoad] = useState(false);
  const [prevUrl, setPrevUrl] = useState(location.pathname);
  const history = window.history;


  
  useEffect(()=> {
    getMyPosts()
    getDetails()
    fetchRequests()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);
  useEffect(() => {
      if (selectedPost1 === null) {
        setPrevUrl(location.pathname);
      }
    }, [selectedPost1, location.pathname]);
  useEffect(() => {
      window.onpopstate = function(event) {
        if (event.state && event.state.postId) {
          const post = myPosts.find(p => p.id === event.state.postId);
          setSelectedPost1(post);
        } else {
          setSelectedPost1(null);
        }
      };
    }, [myPosts]);



  const getMyPosts = async () => {
    const {data} = await axios.get(`/api/posts/my-posts/${params.id}`)
    if(data.success) {
      setMyPosts(data.myPosts)
    }
  }
  const getDetails = async() => {
    setDetailzLoad(true)
    const {data} = await axios.get(`/api/users/user-details/${params.id}`)
    if(data.success) {
      setDetails(data.details)
      setNewDetails({
        newFirstname: data.details.firstname,
        newLastname: data.details.lastname,
        newBirthdate: data.details.birthdate,
        newGender: data.details.gender
      })
      updateAboutz({
        bio: data.details.about.bio,
        city: data.details.about.city,
        country: data.details.about.country,
        worksAt: data.details.about.worksAt,
        education: data.details.about.education
      })
      setDetailzLoad(false)
    }
  }

  


  useEffect(() => { console.log("Current image state:", img); }, [img]);
  useEffect(() => { 
    if (img && typeof img === 'object' && img instanceof Blob) { 
      const objectUrl = URL.createObjectURL(img); 
      setImgUrl(objectUrl); 
      return () => URL.revokeObjectURL(objectUrl); // Clean up old URLs 
    } else { 
      setImgUrl(null); // Reset for data URLs or null 
    } 
  }, [img]);

  const showPost1 = (post) => { 
    setSelectedPost1(post); 
    history.pushState({ postId: post?._id }, '', `/postz/${post?._id}`); 
  }; 
  const closePost1 = () => { 
    setSelectedPost1(null); 
    window.history.back();
    //history.replaceState({}, '', prevUrl); 
  };
  const handleImgClick = (pic) => { 
    setSelectImg(pic); 
  };
  const handleClosePicModal = () => { 
    setSelectImg(null); 
};


  const profileId = params.id;

  useEffect(() => { 
    if(params?.id !== user?.id){
      const fetchRelationshipStatus = async () => { 
      try { const response = await axios.post(`/api/requests/check-relationship-status`, {profileId}); 
        setRelationshipStatus(response.data.status); 
      } catch (error) { 
        console.error('Error fetching relationship status:', error); 
      } 
    }; 
    fetchRelationshipStatus(); 
    } else {
      setRelationshipStatus('self'); 
    }
    
}, [params?.id, user?.id, profileId]);

const updateAbout = async()=> {
  setAbtLoader(true)
  const { data }= await axios.put('/api/users/update-about', aboutz);
  if(data.success) {
    setDetails(prevDetails => ({ ...prevDetails, about: data.user.about }));
    updateAboutz({
      bio: data.user.about.bio,
      city: data.user.about.city,
      country: data.user.about.country,
      worksAt: data.user.about.worksAt,
      education: data.user.about.education
    });
    setAbtLoader(false)
    setIsModalOpen3(false)
  } else {
    setIsModalOpen3(false)
  }
}

const handleInputChange = (e) => { 
  setNewDetails({...newDetails, [e.target.name]: e.target.value}); 
};

const handleInputChange1 = (e) => { 
  updateAboutz({...aboutz, [e.target.name]: e.target.value}); 
};


const fetchRequests = async () => { 
  const {data} = await axios.get(`/api/requests/all-friend-requests`);
  setRequests(data); 
};
const acceptRequest = async(requestId) => {
  try {
    setAcpRqtLoad(true)
    const {data} = await axios.post('/api/requests/accept-request', { requestId })
    if(data?.success) {
      setRelationshipStatus('friends')
      toast.success('Friend request sent')
      setIncomingRequestDrp(false)
      setAcpRqtLoad(false)
    }
  } catch (error) {
    console.log(error)
    setAcpRqtLoad(false)
  }
}
const rejectRequest = async(requestId) => {
  try {
    setRjtRqtLoad(true)
    const {data} = await axios.post('/api/requests/reject-request', { requestId });
    if(data?.success) {
      setRelationshipStatus('not_friends')
      setRequests(requestz.filter(reqz => reqz?._id !== requestId))
      setRjtRqtLoad(false)
    }
  } catch (error) {
    console.log(error)
    setRjtRqtLoad(false)
  }
    
}
const cancelRequest = async(requestId) => {
  try {
    setCncRqtLoad(true)
    const {data} = await axios.post('/api/requests/cancel-request', { requestId });
    if(data?.success) {
      setRequests(requestz.filter(reqz => reqz?._id !== requestId))
      setRelationshipStatus('not_friends');
      setCncRqtLoad(false);
    }
  } catch (error) {
    console.log(error)
    setCncRqtLoad(false)
  }
  
}
const sendRequest = async(id)=> {
  try {
    setAddLoad(true)
    const {data}= await axios.post('/api/requests/send-request', { recipientId: id });
    if(data?.success) {
      setRelationshipStatus('request_sent')
      setRequests(prevRequests => [...prevRequests, data?.request])
      toast.success("Friend request sent")
      setAddLoad(false)
    }
  } catch (error) {
    console.log(error)
    setAddLoad(false)
  }
  
}

const handleUpdatePost = (updatedPost) => { 
  setMyPosts(myPosts.map(post => (post?._id === updatedPost._id ? updatedPost : post))); 
};

const updateOnDelete = (postId)=> {
  setMyPosts(myPosts.filter(post => post?._id !== postId))
}



  const startCamera = async()=> {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    videoRef.current.srcObject=stream;
    setStream(stream);
    setHide(true)
  }

  const stopCamera = () => { 
    if (stream) { 
      stream.getTracks().forEach(track => track.stop()); 
    } 
    setHide(false)
  };
  const uploadImg = (e) => {
    const file = e.target.files[0]
    setImg(file)
  }
  const uploadCoverImg = (e)=> {
    const file = e.target.files[0];
    setCoverImg(file);
  }

const capturePhoto = () => {
  const canvas = document.createElement("canvas");
  
  // Set the dimensions for the canvas
  const originalWidth = videoRef.current.videoWidth;
  const originalHeight = videoRef.current.videoHeight;
  
  // Draw the video frame onto the canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoRef.current, 0, 0, originalWidth, originalHeight);
  
  canvas.toBlob(blob => { 
    // Set the file object to the img state
    const file = new File([blob], "photo.jpg", { type: "image/jpeg" });  
    setImg(file); 
  }, 'image/jpeg') // No quality parameter for no compression
  
  
  stopCamera();
  setHide(false);
};

const incomingDrop = () => {
  setIncomingRequestDrp(prev => !prev);
}

const clearCoverImg = ()=> {
  setCoverImg(null);
}


const handleFileUpload = async(file)=> {
  const formData = new FormData();
  formData.append('file', file);
  try {
      const { data }= await axios.post('/api/users/uploadProfilePhoto', formData);
      return data.filePath;
  } catch (error) {
      console.error('Error uploading file:', error); 
      return null;
  }
};
const handleFileUpload2 = async(file)=> {
  const formData = new FormData();
  formData.append('file', file);
  try {
      const { data }= await axios.post('/api/users/uploadCoverPhoto', formData);
      return data.filePath;
  } catch (error) {
      console.error('Error uploading file:', error); 
      return null;
  }
};

const submitPhoto = async(e)=> {
  e.preventDefault(); 
  let imageUrl = null;

  if(img) { 
    imageUrl = await handleFileUpload(img); 
  }

  if(imageUrl) {
    const newPhoto = { image: imageUrl };
    try {
      const {data} = await axios.post('/api/users/newProfilePhoto', newPhoto);
      if(data.success) {
        setIsModalOpen2(false)
        setDetails({ ...detailz, profileImg: imageUrl });
        dispatch(updateProfilePic(imageUrl));
        setImg(null)
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log('Error')
  }
  
} 


const coverImageUpload = async(e)=> {
  e.preventDefault();
  let CoverImgUrl = null;

  if(coverImgz) { 
    CoverImgUrl = await handleFileUpload2(coverImgz); 
  }
  if(CoverImgUrl) {
    const newCoverPhoto = { image: CoverImgUrl };
    try {
      const { data } = await axios.post('/api/users/newCoverImg', newCoverPhoto);
      if(data.success) {
        setIsModalOpen(false)
        setDetails({ ...detailz, coverImg: CoverImgUrl });
        dispatch(updateCoverPhoto(CoverImgUrl));
        setCoverImg(null);
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    console.log('Error')
  }

}

const handleProfileUpdate = async () => {
  setProfLoader(true)
  const { data } = await axios.put('/api/users/update-profile', newDetails);
  if(data.success) {
    setDetails({ ...detailz, firstname: data?.user?.firstname, lastname: data?.user?.lastname, birthdate: data.user.birthdate, gender: data.user.gender, age: data.user.age });
    dispatch(updateProfilez(data.user));
    setNewDetails({
      newFirstname: data.user.firstname,
      newLastname: data.user.lastname,
      newBirthdate: data.user.birthdate,
      newGender: data.user.gender
    });
    setIsModalOpen1(false);
    setProfLoader(false);
  } else {
    setProfLoader(false)
  }
}

const showModal3 = () => {
  setIsModalOpen3(true);
};
const handleCancel3 = () => {
  setIsModalOpen3(false);
};

  const tabs = ['Posts', 'About', 'Photos', 'Friends']; 
  const content = { 
    'Posts': 
    <div className='flex scrollbar pr-1 gap-3 max-sm:gap-1 max-sm:justify-around h-full overflow-y-auto max-md:flex-col-reverse justify-between'>
      <div className='md:w-[45%]'>
        {
          myPosts.length === 0 && (
            <div className='w-full flex pt-3 justify-center h-full'>
              <h1 className='text-[18px] font-semibold text-slate-400 dark:text-slate-200'>You have no posts.</h1>
            </div>
          )
        }
        {
          myPosts.length !== 0 && (
            myPosts.map((post, i)=> {
              return(
                <Postz key={post._id} onUpdatePostz={handleUpdatePost} onDelete={updateOnDelete} onClick={() => showPost1(post)} path={location.pathname} post={post}/>
              )
            })
          )
        }
        {
          selectedPost1 && ( 
            <FullViewPost onUpdate={handleUpdatePost} pst={selectedPost1} close={closePost1}/>
          )
        }
      </div>
      <UserDetails userBio={detailz} paramId={params.id} mod={showModal3} />
    </div>, 
    'About': 
    <AboutProfileView userBio={detailz}/>, 
    'Photos': 
    <div className='grid gap-2 grid-cols-5 max-[500px]:grid-cols-2 max-[820px]:grid-cols-4 max-sm:grid-cols-3'>
      {
        myPosts.map((p, i)=> {
          return(
            <Photos key={p._id} img={p?.image} vid={p?.video} />
          )
        })
      }
    </div>,
    'Friends': 
      <div className='w-full dark:bg-facebookDark-200 h-full'>
        <ProfileFrdList/>
      </div>,  
  };
  const showModal = () => {
    setIsModalOpen(true);
};
const showModal1 = () => {
  setIsModalOpen1(true);
};
const showModal2 = () => {
  setIsModalOpen2(true);
};

const handleCancel = () => {
    setIsModalOpen(false);
};
const handleCancel1 = () => {
  setIsModalOpen1(false);
};
const handleCancel2 = () => {
  setIsModalOpen2(false);
  setImg(null)
  stopCamera();
  setHide(false)
};

const friendsCount = detailz?.friends ? detailz.friends.length : 0;
  
  return (
    <Layout>
      <div className='relative min-h-[100vh] overflow-y-auto dark:bg-facebookDark-200 mt-14'>
        <div onClick={() => handleImgClick(detailz?.coverImg)} className='relative h-52 bg-slate-300 overflow-hidden'>
          <img src={detailz?.coverImg || ''} alt="" className='w-full cursor-pointer absolute inset-0 h-full object-cover' />
          <button  onClick={(e) => {e.stopPropagation(); showModal(); }} className={`right-4 ${params.id === user?.id ? "block": "hidden"} active:bg-blue-300 z-30 bottom-4 absolute flex gap-2 items-center p-1 rounded font-medium cursor-pointer text-sm bg-slate-50`}>
            <FaCamera />
            <p className='hidden sm:block'>Edit Cover image</p>
          </button>
        </div>
        <div className='z-10 mx-auto px-4 -mt-14 relative'>
          <div className='flex flex-col items-center md:items-end gap-3 md:flex-row'>
            <div onClick={() => handleImgClick(detailz?.profileImg)} className='border-[3px] relative border-green-400 w-fit rounded-full'>
              <Avatarz height={95} image={detailz?.profileImg}  width={95} name={(detailz?.firstname + " " + detailz?.lastname).toUpperCase()} />
              <div onClick={(e) => {e.stopPropagation(); showModal2(); }} className={`absolute ${params.id === user?.id ? "block": "hidden"} cursor-pointer rounded-full w-8 h-8 bottom-1 p-2 bg-slate-200 flex items-center justify-center -right-2 shadow`}><FaCamera /></div>
            </div>
            {
              detailzLoad ? 
              <div className='flex-grow md:text-left mt-4 md:mt-0 text-center'>
                <h1 className='font-bold animate-pulse h-5 w-20 bg-slate-400 dark:text-slate-200'></h1>
                <p className='text-gray-500 h-4 w-16 animate-pulse bg-slate-400 dark:text-slate-200'></p>
              </div> : 
              <div className='flex-grow md:text-left mt-4 md:mt-0 text-center'>
                <h1 className='font-bold dark:text-slate-200'>{(detailz?.firstname + " " + detailz?.lastname).toUpperCase()}</h1>
                <p className='text-gray-500 dark:text-slate-200'>{formatNumber(friendsCount)} friends</p>
              </div>
            }
            <div className='flex gap-2'>
              {
                relationshipStatus === 'request_received'  && (
                  requestz.map((r, i)=> {
                    return(
                     <div key={i}>
                      {
                        params.id === r?.requestFrom && user?.id === r?.requestTo && (
                            <div onClick={incomingDrop} className={`mt-4 md:mt-0 right-4 active:bg-slate-800 bottom-4 flex gap-2 items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>
                              <div className='flex cursor-pointer items-center relative gap-1'>
                                <p>pending request</p>
                               <IoIosArrowDropdownCircle className='  text-slate-400' />
                              </div>
                               { incomingRequestDrp && (
                                <div className='absolute flex transition ease-out duration-200 transform flex-col gap-2 w-40 bg-slate-400 z-30 rounded-md -bottom-[84px] p-2'>
                                  <button className='p-1 cursor-pointer active:bg-slate-600 active:text-slate-200 rounded-md font-semibold bg-slate-300' onClick={()=> acceptRequest(r?._id)}>Accept</button>
                                  <button className='p-1 cursor-pointer active:bg-slate-600 active:text-slate-200 rounded-md font-semibold bg-slate-300' onClick={()=> rejectRequest(r?._id)}>Reject</button>
                                </div>
                               )}
                            </div>

                          
                        ) 
                      }
                     </div>
                    )
                  })
                )
              }
              {
                relationshipStatus === 'friends' && (
                    <button className={` mt-4 md:mt-0 right-4 bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>
                        Friends
                    </button>
                  )
              }
              {
                relationshipStatus === 'request_sent' && (
                  requestz.map((r, i)=> {
                    return(
                      <div key={i}>
                        {
                          user?.id === r?.requestFrom && params.id === r?.requestTo && (
                              <button onClick={()=> cancelRequest(r?._id)} className={`${params.id === user?.id ? "hidden": "block"} mt-4 md:mt-0 right-4 bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>
                                cancel request
                                <ReactLoading className={`${cncRqtLoad ? "block" : "hidden"}`} type="spin" height={10} width={10}/>
                              </button>
                            
                          ) 
                        }
                      </div>
                    )
                  })
                  )
              }
              {
                relationshipStatus === 'not_friends' && (
                    <button onClick={()=>sendRequest(params.id)} className={`${params.id === user?.id ? "hidden": "block"} mt-4 md:mt-0 right-4 bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>
                        <HiUserAdd/>
                        Add Friend
                        <ReactLoading className={`${addLoad ? "block" : "hidden"}`} type="spin" height={10} width={10}/>
                    </button>
                  )
              }
              
              
              <button onClick={showModal1} className={`${params.id === user?.id ? "block": "hidden"} mt-4 md:mt-0 right-4 bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>
                <LuPenLine />
                Edit Profile
              </button>
              <Link to={`/messages/${params.id}`} className={`${params.id === user?.id ? "hidden": "block"} mt-4 active:bg-slate-700 md:mt-0 right-4 bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>
                Message
              </Link>
            </div>
            
          </div>
          
        </div>
        <div className="w-full h-full mx-auto mt-4  rounded shadow"> 
          <TabNav tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} /> 
          <TabContent content={content[activeTab]} /> 
        </div>
        <Modal open={isModalOpen} footer={null} className='custom-modal' onCancel={handleCancel}>
          <div className='w-full flex gap-2 flex-col items-center'>
            <div className='w-full flex justify-center items-center'>
              <h1 className='font-semibold dark:text-slate-200 md:text-[18px]'>Edit Cover Image</h1>
            </div>
            <div className={`${coverImgz? "block": "hidden"} w-full flex items-center justify-center`}>
              <div className='w-[80%] relative h-48 border rounded'>
                <img className='h-full inset-0 absolute w-full rounded object-cover' src={!coverImgz ? `/${detailz?.coverImg}` : URL.createObjectURL(coverImgz)} alt="" />
                <button className={`${coverImgz? "block": "hidden"} absolute top-1 border bg-slate-300 active:bg-slate-600 border-1px rounded-full p-2 border-slate-500 font-semibold flex items-center justify-center w-10 h-10 right-1`} onClick={clearCoverImg}>x</button>
              </div>
            </div>
            <div className={`${coverImgz? "hidden": "block"} flex w-full items-center justify-center flex-col gap-2`}>
              <button onClick={()=> coverImgRef.current.click()} className={` mt-4 active:bg-slate-700 active:text-slate-200 justify-center md:mt-0 right-4 w-[50%] bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>Upload photo</button>
              <input onChange={uploadCoverImg} ref={coverImgRef} hidden accept='image/*' type="file" />
            </div>
            <div className='w-full flex items-center justify-center'>
              <button onClick={coverImageUpload} className=' font-semibold p-2 w-[70%] bg-green-500 rounded-md dark:text-slate-200'>Submit</button>
            </div>
          </div>
        </Modal>
        <Modal open={isModalOpen1} footer={null} className='custom-modal'  onCancel={handleCancel1}>
          <div className='w-full flex-col flex gap-2'>
              <div>
                <h1 className='font-semibold dark:text-slate-200 md:text-[18px]'>Edit Profile</h1>
              </div>
              <div className='flex flex-col'>
                <p className='dark:text-slate-200'>Firstname</p>
                <input type="text" value={newDetails.newFirstname} onChange={handleInputChange} name='newFirstname'  className='px-2 py-1 border rounded' />
              </div>
              <div className='flex flex-col'>
                <p className='dark:text-slate-200'>Lastname</p>
                <input type="text" value={newDetails.newLastname} onChange={handleInputChange} name='newLastname' className='px-2 py-1 border rounded'/>
              </div>
              <div>
                <p className='dark:text-slate-200'>Date of Birth</p>
                <input onChange={handleInputChange} type="date" value={newDetails.newBirthdate? moment(newDetails.newBirthdate).format('YYYY-MM-DD') : 'choose date'} name='newBirthdate' className='px-2 py-1 border rounded'/>
              </div>
              <div>
                <p className='dark:text-slate-200'>Gender</p>
                <select value={newDetails.newGender} onChange={handleInputChange} name="newGender" id="" className='px-2 py-1 border rounded'>
                  <option value="Male">Male</option>
                  <option value="Femal">Female</option>
                </select>
              </div>
              <div className='w-full flex items-center justify-center px-5'>
                <button onClick={handleProfileUpdate} className={`p-2 ${profLoader ? "animate-pulse": "animate-none"}  border bg-green-700 text-slate-200 font-semibold w-full rounded-md active:bg-green-500`}>{profLoader? 'please wait...' : 'update'}</button>
              </div>
          </div>
        </Modal>
        <Modal open={isModalOpen2} footer={null} className='custom-modal' onCancel={handleCancel2}>
          <div className='w-full flex-col flex gap-2'>
            <div>
              <h1 className='text-[18px] dark:text-slate-200 font-semibold'>Change Profile Photo</h1>
            </div>
            <div className='w-full flex items-center justify-center'>
              <Avatarz height={200} width={200} image={!img? detailz?.profileImg : imgUrl} name={(detailz?.firstname + " " + detailz?.lastname).toUpperCase()}/>
            </div>
            <div className={`relative bg-black ${hide? "block": "hidden"}`}>
              <video ref={videoRef} autoPlay width="100%" /> 
              <button className='absolute bg-slate-500 p-2 border bottom-3 left-3' onClick={capturePhoto}>Capture Photo</button> 
            </div>
            <div className='flex gap-2 justify-center items-center'>
              {
                hide? <button onClick={stopCamera} className={` mt-4 justify-center  md:mt-0 right-4 w-[50%] bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm active:bg-slate-500 bg-slate-300`}>Cancel</button> : 
                <button onClick={startCamera} className={` mt-4 justify-center  md:mt-0 right-4 w-[50%] bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm active:bg-slate-500 bg-slate-300`}>Take Photo</button>
              }
              
              <button onClick={()=> profileImgRef.current.click()} className={` mt-4 active:bg-slate-700 active:text-slate-200 justify-center md:mt-0 right-4 w-[50%] bottom-4 flex gap-2 cursor-pointer items-center p-1 px-1 rounded font-medium text-sm bg-slate-300`}>Upload photo</button>
              <input onChange={uploadImg} ref={profileImgRef} hidden accept='image/*' type="file" />
            </div>
            <div className='w-full flex items-center justify-center px-5'>
              <button onClick={submitPhoto} className='p-2 border bg-green-700 text-slate-200 font-semibold w-full rounded-md active:bg-green-500'>Save</button>
            </div>
            
          </div>
        </Modal>
        <Modal open={isModalOpen3} className='custom-modal' footer={null} onCancel={handleCancel3}>
          <div className='w-full flex flex-col gap-2'>
            <h2 className='w-full dark:text-slate-200 text-xl'>Edit Bio</h2>
            <div className='w-full'>
              <textarea onChange={handleInputChange1} value={aboutz.bio} placeholder='About self...' className='border p-1 w-full border-green-300 rounded-md outline outline-green-300' name="bio" id=""></textarea>
            </div>
            <div className='w-full flex flex-col gap-2'>
              <input onChange={handleInputChange1} value={aboutz.city} className='border rounded-md w-full p-1 outline font-semibold outline-green-500 bg-slate-200' type="text" name='city'  placeholder='city name'/>
              <input onChange={handleInputChange1} value={aboutz.country} className='border rounded-md w-full p-1 outline font-semibold outline-green-500 bg-slate-200' type="text" name='country'  placeholder='Country name'/>
              <input onChange={handleInputChange1} value={aboutz.worksAt} className='border rounded-md w-full p-1 outline font-semibold outline-green-500 bg-slate-200' type="text" name='worksAt' placeholder='work'/>
              <input onChange={handleInputChange1} value={aboutz.education} className='border rounded-md w-full p-1 outline font-semibold outline-green-500 bg-slate-200' type="text" name='education' placeholder='education'/>
            </div>
            <div className='w-full flex items-center justify-center'>
              <button onClick={updateAbout} className={`${abtLoader? "animate-pulse": "animate-none"} w-[70%] font-semibold active:bg-green-800 p-1 rounded-md cursor-pointer bg-green-600 text-slate-50`}>{abtLoader? 'please wait...' : 'update'}</button>
            </div>
          </div>
        </Modal>
        <Modal  className='custom-modal' open={selectImg !== null} onCancel={handleClosePicModal} footer={null}>
              {selectImg && (
                  <img src={selectImg} alt='' className="w-full h-auto" />
              )}
        </Modal>
      </div>
    </Layout>
  )
}

export default ProfilePage