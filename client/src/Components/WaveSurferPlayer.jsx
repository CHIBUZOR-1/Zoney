import React, { useRef, useEffect, useState } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa6';
import WaveSurfer from 'wavesurfer.js';

const WaveSurferPlayer = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#ff0000',
        barRadius: 3,
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        normalize:true,
        responsive: true,
      });

      wavesurfer.current.load(audioUrl);

      // Cleanup on unmount
      return () => {
        wavesurfer.current.destroy();
      };
    }
  }, [audioUrl]);
  const handlePlayRecording = () => {
        //wave.stop();
        wavesurfer.current.play();
        setIsPlaying(true);
}
const handlePauseRecording = ()=> {
    //wave.stop();
    wavesurfer.current.pause();
    setIsPlaying(false);
}

  return (
    <div className='flex w-full items-center gap-1'>
        {
          !isPlaying? (
              <FaPlay className='dark:text-white' onClick={handlePlayRecording} /> 
          ) : ( 
              <FaStop className='dark:text-white' onClick={handlePauseRecording} /> 
          )
        }
        <div className='w-full' ref={waveformRef} />
    </div>
  );
};

export default WaveSurferPlayer;
