import './App.css';
import Main from './components/Main';
import Dashboard from './components/Dashboard';

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
    <div className="App">
      {isLogin ? <Dashboard  token = {token}  /> : <Main isLogin={isLogin} setIslogin =  {setIslogin}  token = {token} setToken = {setToken} setLoginMsg={setLoginMsg} /> }

      
    </div>
  );
}

export default App;
