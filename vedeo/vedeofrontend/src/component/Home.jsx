import React from 'react';
import {useSelector , useDispatch } from 'react-redux';
import VideoUploader from './VideoUploader';
import VideoEditor  from './VideoEditor';
import {useState , useEffect , useRef} from 'react';
import axios from 'axios'
import './style.css'; 
import { getCookie } from '../utils/generalFunction';

axios.defaults.withCredentials = true;
function Home(props) {  
   
   // If session id don't exists than it is used to create a new session id
   useEffect(() => {
       async function fetchdata() {
        var csrftoken = getCookie('csrftoken');
        console.log("inside fetch data")
        var config = {
        method: 'get',
        url: 'http://127.0.0.1:8000/video/home',
        withCredentials : true,
        
        headers: { 
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json',
             
            "X-CSRFToken": csrftoken,
      


        }};
        console.log(config)
        const response = await axios.get("http://127.0.0.1:8000/video/home" , config ).then((res) => {
          console.log("res" , res)
          
         
        });
      }
        fetchdata();
    });

    return (
      <div className="container">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">Video Editor</a>
        </div>
      </nav>

      <div className="row mt-4">
        
          <div className="row">
            
              <VideoUploader />
          </div>
            <div className="row">
              <VideoEditor />
            </div>
          </div>
      
      </div>
  
  
        
      );
    }
   
export default Home;
