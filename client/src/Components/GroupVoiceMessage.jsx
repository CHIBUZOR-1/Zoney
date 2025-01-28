import React, { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import Avatarz from './Avatar';
import { FaPlay, FaStop } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

const GroupVoiceMessage = ({ message }) => {
    const user = useSelector(state => state?.user?.user)
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0)
    
    const waveFormRef = useRef(null);
    const waveForm = useRef(null);
    const initialized = useRef(false); // Track initialization

    useEffect(()=> {
        if(audio) {
            const updatePlaybackTime = () => {
                setCurrentPlaybackTime(audio.currentTime);
            };
            audio.addEventListener("timeupdate", updatePlaybackTime);
            return () => {
                audio.removeEventListener("timeupdate", updatePlaybackTime);
            };
        }
    }, [audio]);

    useEffect(()=> {
        if(waveForm.current===null){
            waveForm.current = WaveSurfer.create({
                container: waveFormRef.current,
                waveColor: "black",
                progressColor: "blue",
                cursorColor: "#7ae3c3",
                barRadius: 3,
                barWidth: 3,
                height: 30,
                responsive: true,
                normalize:true
            });
            
            waveForm.current.on("finish", ()=> {
                setIsPlaying(false)
            });
        }
        return ()=> {
            waveForm.current.destroy();
        };
    }, []);

    useEffect(()=>{
        const audioUrl = message?.audio;
        const audio = new Audio(audioUrl)
        setAudio(audio);
        waveForm.current.load(audioUrl)
        waveForm.current.on("ready", ()=> {
            setTotalDuration(waveForm.current.getDuration());
        });
        
    },[message?.audio]);

    const initializeAudioContext = async () => { 
        if (!initialized.current && waveForm.current && waveForm.current.backend && waveForm.current.backend.ac) { 
            const audioContext = waveForm.current.backend.ac; 
            if (audioContext.state === 'suspended') { 
                await audioContext.resume(); 
            } initialized.current = true; // Mark as initialized 
        } 
    };

    const formatTime = (time) => {
        if(isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handlePlayAudio = async() => {
        
        if(audio) {
            await initializeAudioContext();
            waveForm.current.play();
            audio.play();
            setIsPlaying(true);
        }
    }
    const handlePauseAudio = async()=> {
        if(audio) {
            waveForm.current.pause();
            audio.pause();
            setIsPlaying(false);
        }
    }
  return (
    <div className='flex items-center gap-2'>
        <div>
            {
                message?.sender?._id === user?.id ? (
                    <Avatarz height={30} width={30} image={user?.profilePic} name={(user?.firstname + " " + user?.lastname).toUpperCase()} />  
                ) : (
                    <Avatarz height={30} width={30} image={message?.sender?.profileImg} name={(message?.sender?.firstname + " " + message?.sender?.lastname).toUpperCase()} /> 
                )
            }
          
        </div>
        <div className="cursor-pointer">
            {
                !isPlaying ? 
                (<button onClick={handlePlayAudio}><FaPlay /></button>) : (<button onClick={handlePauseAudio}><FaStop /></button>)
            }
        </div>
        <div className="relative">
            <div className='w-52'ref={waveFormRef}/>
            <div className='text-[11px] pt-1 flex justify-between absolute w-full bottom-[-22px]'>
                <span className='font-semibold'>
                    {
                        formatTime(isPlaying ? currentPlaybackTime : totalDuration)
                    }
                </span>
            </div>
        </div>
    </div>
  )
}

export default GroupVoiceMessage