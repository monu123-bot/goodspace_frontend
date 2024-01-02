import React from 'react'
import Navbar from './Navbar'
import Home from './Home'


import '../css/Main.css'
import Auth from './Auth';


function Main(props) {
 
  return (
    <div id='main'>
       <Navbar className="navbar"/>
       <div className="body">
           <Home/>


         <div className='Auth'  >
          <Auth  props={props} />
          <br/>
          
        </div>
       </div>
    </div>
    
  )
}

export default Main