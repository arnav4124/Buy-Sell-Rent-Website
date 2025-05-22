import React from 'react'
import  { useState, useEffect, useContext } from 'react';
import './Dashboard.css';
import './Search.css';
import './Orders.css';
import './Support.css';
import { useNavigate } from "react-router-dom";
import { LoginContext } from './Parent';
import { ProfileContext } from './Parent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cards from './Cards';
import SearchBar from './Searchbar';
import { OrderContext } from './Parent';
import { set } from 'react-hook-form';
import { use } from 'react';
import { SignupContext } from './Parent';
const Support = () => {
    const navigate = useNavigate();
          const [active, setActive] = useState(' ');
          const { isLogin, setisLogin } = useContext(LoginContext);
          const { profile,setprofile } = useContext(ProfileContext);
          console.log(profile);
          const { order, setorder } = useContext(OrderContext);
           const [loading, setLoading] = useState(false);
           const [error, setError] = useState(null);  
           const [role, setRole] = useState('buyer');
           const [chatContext, setChatContext] = useState('');
            //  const [loading, setLoading] = useState(false);
           const handleClick = (section) => {
            setActive(section);
            navigate(`/${section}`);
        };
        const handleLogout = () => {
          localStorage.removeItem("isLogin");
          localStorage.removeItem("authToken");
          localStorage.removeItem("profile");
          setisLogin(false);
          setlgosignup(false);
        };
      
        const [message, setmessage] = useState('');
        const [chatHistory, setChatHistory] = useState([]);
        
        async function fetch_chat_history() { 
             const userEmail = profile.email;
                console.log("email", userEmail);
                if (!userEmail) {
                    console.error('User email is missing.');
                    return;
                }
            
                try {
                    const response = await fetch(`http://localhost:5000/chathistory?email=${encodeURIComponent(userEmail)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            token: localStorage.getItem('authToken'),
                        },
                    });
                    if(response.status===401){
                      alert("Unauthorized access");
                      setisLogin(false);
                      setlgosignup(false);
              
                      navigate('/');
              
                    }
                    if (!response.ok) {
                        throw new Error(`Failed to fetch chat history: ${response.statusText}`);
                    }
                    const data = await response.json();
                    console.log('data:',data);
                    setChatHistory(data.chatHistory || []);
                }
                catch (error) {
                    console.error('Error fetching chat history:', error);
                    alert('Error fetching chat history');
                }
        }
        useEffect(() => {
            if(profile.email){
                fetch_chat_history();
            }
        },[profile]);
        async function send(){
            if (!message.trim()) {
                alert('Please enter a message.');
                return;
              }
              // append the query to chatcontext with \n
              console.log("abhi message hai",message);
              var str=chatContext+message+'\n';

             setChatContext(str);
             
             console.log('message:',message);
             const payload = {
               UserMessage:message,
               userEmail: profile.email,
               FullQuery: chatContext+message+'\n'
              };
              setChatContext(prev => prev + message + '\n');
              console.log('chatContext:',chatContext);
              console.log('payload:',payload);
              try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('authToken'),
                  },
                  body: JSON.stringify(payload),
                });
                if(response.status===401){
                  alert("Unauthorized access");
                  setisLogin(false);
                  setlgosignup(false);
          
                  navigate('/');
          
                }
                if (!response.ok) {
                  throw new Error(`Failed to send message: ${response.statusText}`);
                }
          
                const data = await response.json();
                setChatHistory((prevHistory) => [...prevHistory, data.chat]);
                setChatContext(prevContext => `${prevContext}\n${data.chat.aiResponse}`);
                setmessage(''); 
              } catch (error) {
                console.error('Error sending message:', error);
                alert('Error sending message');
              } finally {
                setLoading(false);
              }
        }
    
  return (
    <div>
         <div className="topnav">
                <a className={active === 'logout' ? 'active' : ''} onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
                   &nbsp; Logout
                </a>
                {/* <a className={active === 'buy' ? 'active' : ''} onClick={() => handleClick('buy')}>Items</a> */}
                <a className={active === 'sell' ? 'active' : ''} onClick={() => handleClick('sell')}>Sell</a>
                <a className={active === 'mycart' ? 'active' : ''} onClick={() => handleClick('mycart')}>MyCart</a>
                <a className={active === 'ord' ? 'active' : ''} onClick={() => handleClick('ord')}>MyOrders</a>
                <a className={active === 'sold' ? 'active' : ''} onClick={() => handleClick('sold')}>SoldItems</a>
                <a className={active === 'support' ? 'active' : ''} onClick={() => handleClick('support')}>
        Support
        </a>
                <a className={active === 'search' ? 'active' : ''} onClick={() => handleClick('search')}>Search &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg> 

                </a>
                <div className='profile'>
                    <a style={{ 'color': "white", "fontWeight": "100", "fontSize": "18px" }} onClick={()=> handleClick('dashboard')}>{profile.firstname} &nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
</svg>
</a>
                </div>
            </div>
       <div className="support-heading">
       <img
          src="data:image/png;base64,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"
          alt="AI Logo"
          className="ai-logo"
        />
        <h1>Your Support Chat</h1>
      </div>
            <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <p><strong>You:</strong> {chat.userMessage}</p>
            <p><strong>AI:</strong> {chat.aiResponse}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading}
        />
        <button onClick={send} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
    </div>
  )
}

export default Support
