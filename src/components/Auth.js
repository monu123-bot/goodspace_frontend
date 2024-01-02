import React from 'react'
import '../css/Auth.css'
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
function Auth({props}) {

    const enter =async (loginData)=>{
        console.log( "props are ", props)
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
   <>

<h1>Single Click</h1>
      <h3>Login/Signup</h3>
      
<br/>
      <GoogleOAuthProvider
           
           clientId="573232329729-b7cl896krcqalql9nvqkfg0cl5ekpn2u.apps.googleusercontent.com"

                    // clientId="899213514258-50f0jveh7v6tjdsa4a24eojn4nhn91mi.apps.googleusercontent.com"
                    // clientId="899213514258-50f0jveh7v6tjdsa4a24eojn4nhn91mi.apps.googleusercontent.com"

           >

           
      
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
      </>
  )
}
export default Auth