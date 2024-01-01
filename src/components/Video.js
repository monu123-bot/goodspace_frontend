import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone } from "react-icons/fa";
import { IoVolumeMedium } from "react-icons/io5";
import { IoVideocam } from "react-icons/io5";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicSvg from './svg/micSvg';
import '../css/Video.css'
import VideoSvg from './svg/VideoSvg';

function Video({clientMessage, setClientMessage, isOpen, setIsOpen, script, setScript ,isListening, setIsListening, send, setSend, volume ,setVolume}) {
  
  const videoRef = useRef(null);
  
  const [speechText,setSpeechText]=useState([]);
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  
  

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.log(err));
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }



  const handleListening = () => {


    if (isListening) {
      SpeechRecognition.stopListening();
      setClientMessage([...clientMessage,transcript]);
      setScript(transcript)
      setSend(true)
    } else {
      
      SpeechRecognition.startListening();
    }
    setIsListening(!isListening);
  }


  const handleClick=()=>{
    setIsOpen(!isOpen);
  }
  return (
    <div className={(isOpen)?'videoComp ' : 'off-videocomp'}>
        <div className={(isOpen)?'video ' : 'off-video'}>
            <video ref={videoRef} autoPlay muted />
        </div>
        <div className='cameraIcon' >
        <div className={(isOpen)?'off-mic' : 'camera-icon'} onClick={handleClick}>
            {/* <IoVideocam className='camera-btn' /> */}
            <VideoSvg/>
            
        </div>
        {
          (!isOpen) && ( <p style={{color:'white'}} ><b>Video</b></p>)
        }
       
        </div>
        <div className={`mic ${isListening ? 'listening' : ''} ${(isOpen)?'' : 'off-mic'}`} onClick={handleListening}>
             <MicSvg className='microphone' isListening={isListening} />
        </div>

        <div className={(isOpen)?'mainVolConatiner' : 'off-mic'}>
            <div className="volContainer">
              <input type="range" min="0" max="100" onChange={(e)=>{setVolume(e.target.value)}} className='vol-slider'/>
              <IoVolumeMedium className='speaker'/>
            </div>
            <div className="volText">
              <h5>Volume</h5>
            </div>
        </div>
       
    </div>
  )
}

export default Video;




