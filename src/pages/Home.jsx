

// import { cyan } from "@mui/material/colors";
import { useState } from "react";
import {v4 as uuidv4} from 'uuid' ;
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";


import logo from "./Images/Code.png"
import './styles/Home.css'




const Home =()=> {

  const [roomid , setRoomid] = useState('');
  const [username , setUsername] = useState('');

  
  const navigate = useNavigate();

  const createNewRoomId =(e)=>{
      e.preventDefault();  //page does not refresh 
      const id = uuidv4() ;
      setRoomid(id);

      toast.success("Created a room! " , {
        style :{
          borderRadius: '10px',
          color: '#000',
        }
      });
      
  }

  const joinRoom = () =>{
      
      if(!roomid || !username){
        toast.error("Room ID & Username are required");
        return;
      }
      
      //Redirect

      navigate(`/editor/${roomid}`,{
        //sending info from one router to other which can be also done using redux store and many other option 
        //it is used in socket.js for getting username 
        state:{
          username,
        },

      });
  }

  const handleBtnEnter = (e) =>{
    // console.log("event" , e.code);

    if(e.code === 'Enter'){
       joinRoom();
    }
  }

  return (
    <>
      <div className="homePage">
          <div className="formPage">
            <img className="homeLogo"src={logo}/>
            <h4 style={{fontSize:"12px"}}>Paste invitation ROOM ID</h4>
            <div className="inputGroup">
              <input 
                type="text" 
                className="inputfield" 
                placeholder="ROOM ID"
                onChange={(e) => setRoomid(e.target.value)}
                value={roomid}
                onKeyUp={handleBtnEnter}
                ></input>
              <input 
                type="text" 
                className="inputfield" 
                placeholder="USERNAME"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                onKeyUp={handleBtnEnter}
                ></input>
              <button className="btn joinBtn" onClick={joinRoom}>Join</button>
            </div>
            <span className="createInfo">If you don't have invite then create &nbsp;
            <a onClick={createNewRoomId} href="" className="createNewBtn">
              new room
            </a>
            </span>
            
          </div>
            <footer className="footer">
              <span>Created with&nbsp; ♥️ &nbsp;by &nbsp; </span>
              <a href="">Snehal</a>
            </footer>
            
      </div>
     
    </>

  )
}


export default Home;