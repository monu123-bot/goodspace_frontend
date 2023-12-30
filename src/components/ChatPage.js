import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import VideoRecorder from './VideoRecorder';

const ChatPage = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  let [recordOption, setRecordOption] = useState("video");
  const toggleRecordOption = (type) => {
      return () => {
          setRecordOption(type);
      };
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');

        setRecognizedText(transcript);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };
  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Replace with your server URL
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
      socket.emit('messageFromClient', recognizedText);
    }
  };

  return (
    <>
    <div>
      <h1>Socket.IO Chat</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <p>Received Message: {receivedMessage}</p>
      </div>
    </div>
    <div>
      <h1>Speech Recognition</h1>
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop Listening
      </button>
      <div>
        <p>Recognized Text: {recognizedText}</p>
      </div>
    </div>
    
    <div>
            <h1>React Media Recorder</h1>
            <div className="button-flex">
                <button onClick={toggleRecordOption("video")}>
                  Record Video
                </button>
                <button onClick={toggleRecordOption("audio")}>
                  Record Audio
                </button>
            </div>
            <div>
                {recordOption === "video" ? <VideoRecorder /> : "Please select sosmething"}
            </div>
        </div>
   </>
  );
};

export default ChatPage;