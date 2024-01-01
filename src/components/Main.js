import React from 'react'
import Navbar from './Navbar'
import Home from './Home'

import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
import '../css/Main.css'
function Main(props) {
  const enter =async (loginData)=>{
    // const resp = await  axios.post('http://localhost:4000/login',loginData)
    
  try {
    const resp = await axios.post('https://goodspace-backend.onrender.com/api/user/login',loginData)
    console.log(resp)
    const token1 = resp.headers.authorization
    localStorage.setItem('token', token1);
    props.setToken(token1)
    props.setIslogin(true)
    

    
  } catch (error) {
    props.setLoginMsg(error)
    console.log(error)
  }
 
}
  return (
    <div id='main'>
       <Navbar className="navbar"/>
       <div className="body">
           <Home/>


         <div className='Auth'  >
           <GoogleOAuthProvider clientId="573232329729-b7cl896krcqalql9nvqkfg0cl5ekpn2u.apps.googleusercontent.com">
      
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
        
        

        </GoogleOAuthProvider>
        </div>
       </div>
    </div>
    
  )
}

export default Main