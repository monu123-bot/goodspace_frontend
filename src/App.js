import logo from './logo.svg';
import './App.css';
import ChatPage from './components/ChatPage';
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
function App() {
  const [isLogin,setIslogin] =     useState(false)
  const [loginMsg, setLoginMsg] = useState(null);
  const [token,setToken] = useState(null)
  const enter =async (loginData)=>{
    // const resp = await  axios.post('http://localhost:4000/login',loginData)
    
  try {
    const resp = await axios.post('http://localhost:5000/api/user/login',loginData)
    console.log(resp)
    const token1 = resp.headers.authorization
    localStorage.setItem('token', token1);
    setToken(token1)
    setIslogin(true)
    

    
  } catch (error) {
    setLoginMsg(error)
    console.log(error)
  }
 
}
  return (
    <>
    {isLogin ? <ChatPage  token = {token}  /> : <GoogleOAuthProvider clientId="573232329729-b7cl896krcqalql9nvqkfg0cl5ekpn2u.apps.googleusercontent.com">
      
      <GoogleLogin
    onSuccess={credentialResponse => {
      const decoded = jwtDecode(credentialResponse.credential);
      enter(decoded)
      console.log(decoded);
    }}
    onError={() => {
      console.log('Login Failed');
    }}
  />;
        
        
        </GoogleOAuthProvider> }


    
    </>
  );
}

export default App;
