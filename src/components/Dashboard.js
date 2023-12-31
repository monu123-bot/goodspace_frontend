import React, { useEffect } from 'react'
import Video from './Video'
import Chat from './Chat'
import Navbar from './Navbar'
import { FaPause } from "react-icons/fa6";
import { LuPause } from "react-icons/lu";
import { useState } from 'react';
import io from 'socket.io-client';
import '../css/Dashboard.css'
function Dashboard(props) {
  const [isOpen,setIsOpen]=useState(true);
  const [clientMessage,setClientMessage]=useState([]);
  const [socket, setSocket] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [script,setScript] = useState('')
  const [send,setSend] = useState(false)
  const [isListening, setIsListening] = useState(false);
  
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

  useEffect(() => {
    if (socket) {
      // Listen for messages from the server
      socket.on('messageFromServer', (message) => {
        setReceivedMessage(message);
      });
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit('messageFromClient', script);
    }
  };
  useEffect(() => {
     if(send){
      sendMessage()
      setSend(false)
     }
  }, [send]);
  
  return (
    <div className='Dashboard'>
        <Navbar/>
        {receivedMessage}
        {(isOpen)?(<Video clientMessage={clientMessage} setClientMessage={setClientMessage} isOpen={isOpen} setIsOpen={setIsOpen}  script={script} setScript={setScript}  isListening={isListening} setIsListening={setIsListening} send={send} setSend={setSend} />):(<Chat clientMessages={clientMessage} isOpen={isOpen} setIsOpen={setIsOpen} token = {props.token}  />)}
        <div className="lower">
           {(!isOpen)?(<Video clientMessage={clientMessage} setClientMessage={setClientMessage} isOpen={isOpen} setIsOpen={setIsOpen} script={script} setScript={setScript}  />):(<Chat clientMessages={clientMessage} isOpen={isOpen} setIsOpen={setIsOpen} isListening={isListening} setIsListening={setIsListening} send={send} setSend={setSend} token = {props.token}  />)}
           <div className="pauseIcon">
              <LuPause className='pausebtn'/>
           </div>
           
        </div>
       
    </div>
  )
}

export default Dashboard




