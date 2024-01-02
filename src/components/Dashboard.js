import React, { useEffect } from 'react'

import Video from './Video'
import Chat from './Chat'
import Navbar from './Navbar'

import { FaPlay } from "react-icons/fa";
import { LuPause } from "react-icons/lu";
import { useState } from 'react';

import io from 'socket.io-client';
import '../css/Dashboard.css';
import PauseSvg from './svg/PauseSvg';

const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();

function Dashboard(props) {

  const [isOpen, setIsOpen] = useState(true);
  const [clientMessage, setClientMessage] = useState([]);
  const [socket, setSocket] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState('');

  const [script, setScript] = useState('')
  const [send, setSend] = useState(false)
  const [isListening, setIsListening] = useState(false);

  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);


  
  useEffect(() => {
    const newSocket = io('https://goodspace-backend.onrender.com/',
      {
        // You can pass additional data in the query string
        query: {
          authToken: props.token,
          // Other data you want to send for authentication or identification
        }
      }


    ); // Replace with your server URL
    setSocket(newSocket);

    // Clean up on unmount
    return () => newSocket.disconnect();
  }, []);



  const onSpeak = async (message) => {

    if (synth.speaking) return; // Don't play if speech synthesis is ongoing

    const text = message
    if (text !== '') {
      setIsSpeaking(true)
      
      utterance = new SpeechSynthesisUtterance(text);
      
      
      // console.log(utterance)
      synth.speak(utterance);
    }


    // const selectedVoice = voices.find(voice => voice.lang === 'en-US');
    // speak({ text: message,voice:selectedVoice,rate:1,pitch:0.1 })
  }


 

  useEffect(() => {
    if (socket) {
      // Listen for messages from the server
      socket.on('messageFromServer', (data) => {

        const { token1, resp } = data
        let tokenPart = props.token
        tokenPart = tokenPart.split(' ')[1]
        console.log("data from server", data.token, tokenPart)

        // Assuming you want to append to the first element with the class 'clientMessage'
        let outerDiv = document.querySelector('.clientMessage');

        let divs = outerDiv.querySelectorAll('div');

        if (divs.length > 0) {
          let lastDiv = divs[divs.length - 1];
          outerDiv.removeChild(lastDiv);
        }

        if (outerDiv) {
          if (toString(token1) == toString(tokenPart)) {
            setReceivedMessage(resp);
            
            onSpeak(resp)

            let newMessageDiv = document.createElement('div');
            newMessageDiv.className = 'left messagediv';

            let messageParagraph = document.createElement('p');

            messageParagraph.className = 'messagep';
            messageParagraph.textContent = resp; // Use textContent to set text

            newMessageDiv.appendChild(messageParagraph);
            outerDiv.appendChild(newMessageDiv);
          }
          else {
            console.log("you are not")
          }

        }
      });
    }
  }, [socket]);

  useEffect(() => {
    let outerDiv = document.querySelector('.clientMessage');
    if (isListening) {
      let newMessageDiv1 = document.createElement('div');
      newMessageDiv1.className = 'right messagediv';

      let messageParagraph1 = document.createElement('p');
      messageParagraph1.className = 'messagep';
      messageParagraph1.innerHTML = `
          <p class="wavy-line wavy-line-black" data-text="xxxxxxxxxxxxxx"></p>
          
          ` ; // Use textContent to set text

      newMessageDiv1.appendChild(messageParagraph1);
      outerDiv.appendChild(newMessageDiv1);
    }
    else {
      let divs = outerDiv.querySelectorAll('div');

      if (divs.length > 0) {
        let lastDiv = divs[divs.length - 1];
        outerDiv.removeChild(lastDiv);
      }
    }

  }, [isListening])
  
  


  const sendMessage = () => {

    if (socket) {

      socket.emit('messageFromClient', script);
      // Assuming you want to append to the first element with the class 'clientMessage'
      let outerDiv = document.querySelector('.clientMessage');

      if (outerDiv) {
        let newMessageDiv = document.createElement('div');
        newMessageDiv.className = 'right messagediv';

        let messageParagraph = document.createElement('p');
        messageParagraph.className = 'messagep';
        messageParagraph.textContent = script; // Use textContent to set text

        newMessageDiv.appendChild(messageParagraph);
        outerDiv.appendChild(newMessageDiv);




        let newMessageDiv1 = document.createElement('div');
        newMessageDiv1.className = 'left messagediv';

        let messageParagraph1 = document.createElement('p');
        messageParagraph1.className = 'messagep';
        messageParagraph1.innerHTML = `
          <p class="wavy-line wavy-line-green" data-text="xxxxxxxxxxxxxx"></p>
          `; // Use textContent to set text

        newMessageDiv1.appendChild(messageParagraph1);
        outerDiv.appendChild(newMessageDiv1);






      }
    }
    setScript('')
  };

  setInterval(()=>{
     if(!synth.speaking){
         setIsSpeaking(false)
     }
  },1000)
  useEffect(() => {
    if (send) {
      sendMessage()

      setSend(false)
    }
  }, [send]);

  return (
    <div className='Dashboard'>
      <Navbar />
      
      {(isOpen) ? (<Video clientMessage={clientMessage} setClientMessage={setClientMessage} isOpen={isOpen} setIsOpen={setIsOpen} script={script} setScript={setScript} isListening={isListening} setIsListening={setIsListening} send={send} setSend={setSend} volume={volume} setVolume={setVolume} />) :

        (<Chat isOpen={isOpen} setIsOpen={setIsOpen} token={props.token} messagerecieve={receivedMessage} messagesent={script} setScript={setScript} setSend={setSend} />)}


      <div className="lower">
        {(!isOpen) ? (<Video clientMessage={clientMessage} setClientMessage={setClientMessage} isOpen={isOpen} setIsOpen={setIsOpen} script={script} setScript={setScript} isListening={isListening} setIsListening={setIsListening} send={send} setSend={setSend} volume={volume} setVolume={setVolume} />) :

          (<Chat isOpen={isOpen} setIsOpen={setIsOpen} token={props.token} messagerecieve={receivedMessage} messagesent={script} setScript={setScript} setSend={setSend} />)}


        <div className={  `${(isOpen) ? 'pauseIcon' : 'off-pauseIcon'} pIcon `}>
          <div onClick={   ()=>{
            
            if(isSpeaking){
              setIsSpeaking(false)
              synth.pause()
            }
            else{
              setIsSpeaking(true)
              synth.resume()
            }
            
          console.log('clicked')
          
          }} >
            {
              (isSpeaking) ? <PauseSvg/>  : <FaPlay className='pausebtn' />


            }
          </div>

          {(isSpeaking) ? <p style={{color:'white'}} ><b>Pause</b></p> : <p style={{color:'white'}}><b>Resume</b></p>}




        </div>

      </div>

    </div>
  )
}

export default Dashboard




