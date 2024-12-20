import React, { useEffect, useRef, useState } from 'react'
import { FaCirclePause, FaMicrophone, FaPlay, FaStop, FaTrash } from 'react-icons/fa6'
import { IoMdSend } from 'react-icons/io'
import WaveSurfer from 'wavesurfer.js'

const VoiceRecorder = ({hide, onStopRecording, onSend}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recorded, setRecorded] = useState(null);
    const [wave, setWave] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [renderedAudio, setRenderedAudio] = useState(null);

    const audioRef = useRef(null)
    const waveRef = useRef(null)
    const recorderRef = useRef(null)

    useEffect(()=> {
        let interval;
        if(isRecording) {
            interval = setInterval(()=> {
                setDuration((prevDuration)=> {
                    setTotalDuration(prevDuration + 1);
                    return prevDuration + 1;
                });
            }, 1000);
        }

        return ()=> {
            clearInterval(interval);
        };
    }, [isRecording]);

    useEffect(()=> {
        const wavesurfer = WaveSurfer.create({
            container: waveRef.current,
            waveColor: "#ccc",
            progressColor: "#4a9eff",
            cursorColor: "#7ae3c3",
            barWidth: 2,
            height: 30,
            responsive: true,
        });
        setWave(wavesurfer)
        wavesurfer.on("finish", ()=> {
            setIsPlaying(false)
        });

        return ()=> {
            wavesurfer.destroy();
        }
    }, []);

    useEffect(()=> {
        if(wave) handleStartRecording();
    }, [wave]);

    const handleStartRecording = ()=> {
        setDuration(0)
        setCurrentPlaybackTime(0)
        setTotalDuration(0)
        setIsRecording(true)
        setRecorded(null)
        navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=> {
            const mediaRecorder = new MediaRecorder(stream);
            recorderRef.current = mediaRecorder;
            audioRef.current.srcObject = stream;

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = ()=> {
                const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus'});
                const audioUrl = URL.createObjectURL(blob);
                const audio = new Audio(audioUrl);
                setRecorded(audio); 
                wave.load(audioUrl); 
                //if (onStopRecording) onStopRecording(blob);
            };
            mediaRecorder.start();
        }).catch((error)=> {
            console.error("Error accessing microphone:", error);
        });
    }
    const handleStopRecording = () => {
        if(recorderRef.current && isRecording) {
            recorderRef.current.stop();
            setIsRecording(false);
            wave.stop();

            //STOP ALL AUDIO TRACKS
            const tracks = audioRef.current.srcObject.getTracks(); 
            tracks.forEach(track => track.stop()); 
            audioRef.current.srcObject = null; // Clear the srcObject

            const audioChunks = [];
            recorderRef.current.addEventListener("dataavailable", (event)=> {
                audioChunks.push(event.data);
            });

            recorderRef.current.addEventListener("stop", ()=> {
                const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
                const audioFile = new File([audioBlob], "recording.mp3");
                setRenderedAudio(audioFile);
                if (onStopRecording) onStopRecording(audioFile);
            })
        }
    }

    useEffect(()=> {
        if(recorded) {
            const updatePlaybackTime = () => {
                setCurrentPlaybackTime(recorded.currentTime);
            };
            recorded.addEventListener("timeupdate", updatePlaybackTime);
            return () => {
                recorded.removeEventListener("timeupdate", updatePlaybackTime);
            };
        }
    }, [recorded]);
    
    const handlePlayRecording = () => {
        if(recorded) {
            //wave.stop();
            wave.play();
            recorded.play();
            setIsPlaying(true);
        }
    }
    const handlePauseRecording = ()=> {
        //wave.stop();
        recorded.pause();
        wave.pause();
        setIsPlaying(false);
    }

    const formatTime = (time) => {
        if(isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

  return (
    <div className='flex bg-slate-600 text-2xl w-full justify-end items-center'>
        <div className='pt-1'>
            <FaTrash className=' cursor-pointer text-slate-100 animate-pulse' onClick={()=> hide()}/>
        </div>
        <div className='mx-4 py-2 text-white text-lg flex gap-3 justify-center items-center rounded-full drop-shadow-lg '>
            {
                isRecording ? (
                    <div className='text-red-500 animate-pulse text-center'>
                        Recording <span>{duration}s</span>
                    </div>
                ) : (
                    <div>
                        {recorded && ( 
                            <>
                                {!isPlaying? (
                                    <FaPlay onClick={handlePlayRecording} /> 
                                ) : ( 
                                    <FaStop onClick={handlePauseRecording} /> 
                                )}
                            </>
                        )}
                    </div>
                )
            }
            <div className="w-60" ref={waveRef} hidden={isRecording}/>
            {
                recorded && isPlaying && (
                    <span>{formatTime(currentPlaybackTime)}</span>
                )
            }
            {
                recorded && !isPlaying && (
                    <span>{formatTime(totalDuration)}</span>
                )
            }
            <audio ref={audioRef} hidden/>
        </div>
        <div className="mr-4">
            {
                !isRecording ? (
                    <FaMicrophone className='text-red-500' onClick={handleStartRecording}/>
                ) : (
                    <FaCirclePause className='text-red-500' onClick={handleStopRecording}/>
                )
            }
        </div>
        <div>
            <IoMdSend onClick={onSend} className='cursor-pointer mr-4'/>
        </div>
            
    </div>
  )
}

export default VoiceRecorder