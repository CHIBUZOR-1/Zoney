import React, { useEffect, useRef, useState } from 'react';
import { FaCirclePause, FaMicrophone, FaTrash } from 'react-icons/fa6'
import { IoMdSend } from 'react-icons/io'
import WaveSurferPlayer from './WaveSurferPlayer';

const AudioRecorder = ({hide, onSend, onStopRecording}) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    startRecording();
    return () => {
      // Cleanup on unmount
      stopRecording();
      clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    const audioChunks = [];
    mediaRecorderRef.current.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    mediaRecorderRef.current.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      setAudioBlob(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      onStopRecording(audioBlob)
    });

    mediaRecorderRef.current.start();
    setRecording(true);
    startTimer();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
      stopTimer();
      if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  //<audio controls src={audioUrl}></audio>

  return (
    <div className='flex w-full justify-end gap-3 items-center'>
        <div className='pt-1 flex items-center'>
            <FaTrash className='cursor-pointer text-slate-100 animate-pulse' onClick={()=> hide()}/>
        </div>
        {audioUrl && <WaveSurferPlayer audioUrl={audioUrl}/>}
        {recording && ( 
                    <div className='text-red-500 animate-pulse text-center'>
                        Recording <span>{formatTime(timer)}s</span>
                    </div>
                )}
        {
            !recording ? (
                <FaMicrophone className='text-red-500' onClick={startRecording}/>
            ) : (
                <FaCirclePause className='text-red-500' onClick={stopRecording}/>
            )
        }
        <div className={`${recording ? 'hidden': 'flex'} items-center`}>
            <IoMdSend onClick={()=>{onSend(); hide()}} className='cursor-pointer text-[24px] dark:text-white pr-2'/>
        </div>
    </div>
  );
};

export default AudioRecorder;
