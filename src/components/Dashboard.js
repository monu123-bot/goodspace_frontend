import React, { useEffect } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import Video from './Video'
import Chat from './Chat'
import Navbar from './Navbar'
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { LuPause } from "react-icons/lu";
import { useState } from 'react';

import io from 'socket.io-client';
import '../css/Dashboard.css';


function Dashboard(props) {

  const [isOpen, setIsOpen] = useState(true);
  const [clientMessage, setClientMessage] = useState([]);
  const [socket, setSocket] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [script, setScript] = useState('')
  const [send, setSend] = useState(false)
  const [isListening, setIsListening] = useState(false);
  const [chatArray, setChatArray] = useState([])
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    const newSocket = io('http://localhost:5000',
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

    speak({ text: message })

  }

  useEffect(() => {
    if (socket) {
      // Listen for messages from the server
      socket.on('messageFromServer', (data) => {
          
        const {token1,resp} = data
        let tokenPart = props.token
        tokenPart =  tokenPart.split(' ')[1]
        console.log( "data from server", data.token,tokenPart)

        // Assuming you want to append to the first element with the class 'clientMessage'
        let outerDiv = document.querySelector('.clientMessage');

        if (outerDiv ) {
          if (toString(token1) == toString(tokenPart)){
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
          else{
            console.log("you are not")
          }
         
        }
      });
    }
  }, [socket]);



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
      }
    }
    setScript('')
  };
  useEffect(() => {
    if (send) {
      sendMessage()

      setSend(false)
    }
  }, [send]);

  return (
    <div className='Dashboard'>
      <Navbar />

      {(isOpen) ? (<Video clientMessage={clientMessage} setClientMessage={setClientMessage} isOpen={isOpen} setIsOpen={setIsOpen} script={script} setScript={setScript} isListening={isListening} setIsListening={setIsListening} send={send} setSend={setSend} />) :

        (<Chat isOpen={isOpen} setIsOpen={setIsOpen} token={props.token} messagerecieve={receivedMessage} messagesent={script} setScript={setScript} setSend={setSend} />)}
      
      
      <div className="lower">
        {(!isOpen) ? (<Video clientMessage={clientMessage} setClientMessage={setClientMessage} isOpen={isOpen} setIsOpen={setIsOpen} script={script} setScript={setScript} />) :

          (<Chat isOpen={isOpen} setIsOpen={setIsOpen} token={props.token} messagerecieve={receivedMessage} messagesent={script} setScript={setScript} setSend={setSend} />)}
        <div className="pauseIcon">

          {
            (isListening) ? <LuPause className='pausebtn' /> : <FaPlay className='pausebtn' />


          }




        </div>

      </div>

    </div>
  )
}

export default Dashboard




