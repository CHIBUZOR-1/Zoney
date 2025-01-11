import React, { useEffect, useRef, useState } from 'react'
import Story from './Story'
import { IoMdAdd } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import axios from 'axios';
import { Modal } from 'antd';
import { useAuth } from '../Context/AppContext';


const StoryReel = () => {
    const [storys, setStorys] = useState([]);
    const scrollRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const [medias, setMedia] = useState(null);
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(false)
    const [mediaType, setMediaType] = useState('');
    const { socket } = useAuth();


    useEffect(() => {
        handleScroll(); // Check initial scroll position
        const ref = scrollRef.current; if (ref) { 
            ref.addEventListener('scroll', handleScroll); } // Cleanup event listener on unmount 
            return () => { 
                if (ref) { 
                    ref.removeEventListener('scroll', handleScroll);
                } 
            };
    }, [storys?.length]);

    const fetchStories = async () => { 
        try { 
            setLoading(true)
            const { data } = await axios.get('/api/storys/all-stories'); 
            if (data.success) { 
                setStorys(data.stories);
                setLoading(false)
            } 
        } catch (error) { 
            console.error('Error fetching stories', error); 
            return []; 
        } 
    };


    const uploadStoryFile = async (file) => { 
        try { 
            const formData = new FormData(); 
            formData.append('file', file); 
            const { data } = await axios.post('/api/storys/upload-story-file', formData); 
            return data.filePath; 
        } catch (error) { 
            console.error('Error uploading story file', error); 
            return null; 
        } 
    };

    const addStory = async (e) => { 
        e.preventDefault();
        let filePath = null;
        if (medias) {
           filePath = await uploadStoryFile(medias); 
        }

        const newStory = {media: filePath, type: mediaType}
        
        try { 
            const { data } = await axios.post('/api/storys/newStory', newStory); 
            if (data.success) { 
                //setStorys(prevStories => [...prevStories, data.populatedStory]); 
                setMedia(null); 
                setIsModalOpen(false);  
            } 
        } catch (error) { 
            console.error('Error adding story', error); 
            return null; 
        } 
    };
    const uploadFile = (e) => {
        const file = e.target.files[0];
        if (file) { 
            setMedia(file); 
            setMediaType(file.type.startsWith('image/') ? 'image' : 'video'); 
        }
    }

    
    useEffect(()=> {
        fetchStories()
        if (socket) { 
            socket.on('storyAdded', (populatedStory) => { 
                setStorys(prevStories => [populatedStory, ...prevStories]); 
            }); 
        }
        return () => { 
            if (socket) { 
                socket.off('storyAdded'); 
            } 
        };
    }, [socket]);

    const clearFile = () => {
        setMedia(null);
        setMediaType('')
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };
    console.log(storys)

    const image = "https://th.bing.com/th/id/R.1a55f5ba7e7b362606d795d937c1a756?rik=9kFAUyaW%2fndJzg&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1518568814500-bf0f8d125f46%3fixlib%3drb-1.2.1%26q%3d80%26fm%3djpg%26crop%3dentropy%26cs%3dtinysrgb%26w%3d1080%26fit%3dmax%26ixid%3deyJhcHBfaWQiOjEyMDd9&ehk=%2fv8YRvLrlL4HUO0ZkMIErygOtLDDjC25LZlmksp6Ttc%3d&risl=&pid=ImgRaw&r=0";
  return (
    <div className=' relative w-full'>
        {showLeftButton && (
                <button
                    className="absolute flex top-1/2 left-0 z-10 bg-gray-100 text-slate-500 p-2 rounded-full m-2"
                    onClick={scrollLeft}
                >
                     <FaAngleLeft />
                </button>
            )
        }
        <div ref={scrollRef} onScroll={handleScroll} style={{ scrollBehavior: 'smooth' }} className="flex overflow-x-auto scrollbar-hide gap-3 p-1">
            <div className="flex-none justify-center h-44 w-32 rounded relative shadow  flex-col bg-white items-center"> 
                <div className='w-full '>
                    <img src={image} className='h-[70%] absolute w-full object-cover rounded' alt="" />
                </div>
                <div className="flex right-11 rounded-full border-white active:bg-green-400 cursor-pointer border-[3px] bg-green-700 absolute w-10 h-10  justify-center items-center bottom-[10%] mb-2"> 
                    <IoMdAdd onClick={showModal} className='text-white ' />
                </div> 
                <p className="text-sm absolute right-6 bottom-2 font-medium ">Create story</p> 
            </div>
            {
                loading && (
                    <div className="flex flex-col items-center justify-center h-44 w-32 rounded shadow bg-slate-400 animate-pulse text-center">
                    </div>
                )
            }
            {
                !loading && storys.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-44 w-32 rounded shadow bg-slate-100 text-center">
                        <p className="text-sm font-medium text-slate-500">No stories yet.</p>
                    </div>
                )
            } 
            { 
                !loading && storys.length > 0 &&(
                    storys.map((st, index) => (
                        <Story key={st?._id} stry={st}/>
                    ))
                )
            }
                {showRightButton && (
                    <button
                        className="absolute top-1/2 right-0 z-10 bg-gray-100 text-slate-500 p-2 rounded-full m-2"
                        onClick={scrollRight}
                    >
                        <FaAngleRight />
                    </button>
                )
            }
        </div>
        <Modal  className='custom-modal' open={isModalOpen} footer={null} onCancel={handleCancel}>
            <div className='w-full flex flex-col gap-2'>
                <h2 className='flex text-xl dark:text-slate-100'>Create Story</h2>
                <label htmlFor="uploadz">
                    <div className='w-full dark:border-slate-600 relative h-44 border-slate-400 border rounded-md'>
                        {
                            medias ? (
                                mediaType === 'image' ? ( 
                                <img className='w-full h-full object-scale-down' src={URL.createObjectURL(medias)} alt="Uploaded" /> 
                                ) : ( <video muted className='w-full h-full object-scale-down' controls src={URL.createObjectURL(medias)} type={medias.type} /> )
                            ) : (
                                <div className='flex w-full h-full items-center justify-center'>
                                    <p className='text-xl cursor-pointer p-2 dark:border-slate-600  border rounded-md border-slate-400 text-slate-400'>Upload story</p>
                                </div>
                            )
                        }
                        <button className={`${medias? "block": "hidden"} absolute top-1 border bg-slate-300 active:bg-slate-600 border-1px rounded-full p-2 border-slate-500 font-semibold flex items-center justify-center w-10 h-10 right-1`} onClick={clearFile}>x</button>
                    </div>
                </label>
                <input type="file" id='uploadz' onChange={uploadFile} hidden />
                <div className='flex gap-2 w-full justify-center  items-center'>
                    <button onClick={addStory} className='bg-green-500 active:bg-green-800 flex text-slate-200 font-semibold text-[15px] justify-center p-2 w-full rounded-md'>
                        Create
                    </button>
                </div>
                
            </div>
        </Modal>
    </div>
  )
}

export default StoryReel