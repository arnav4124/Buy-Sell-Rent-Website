import React, { useState, useEffect, useContext } from 'react';
import './Dashboard.css';
import './Search.css';
import './Orders.css';
import { useNavigate } from "react-router-dom";
import { LoginContext } from './Parent';
import { ProfileContext } from './Parent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cards from './Cards';
import SearchBar from './Searchbar';
import { OrderContext } from './Parent';
import Orders from './Orders';
import './DelieverItems.css';
import { SignupContext } from './Parent';
import { set } from 'react-hook-form';
const DelieverItems = () => {
     const navigate = useNavigate();
        const [active, setActive] = useState('');
        const { isLogin, setisLogin } = useContext(LoginContext);
        const { profile,setprofile } = useContext(ProfileContext);
        console.log(profile);
        // const { order, setorder } = useContext(OrderContext);
         const [loading, setLoading] = useState(true);
         const [error, setError] = useState(null);  
         const [role, setRole] = useState('buyer');
         const [Orders,setOrders]=useState([]);
         const [otp, setOtp] = useState([]); // Store OTPs for each order
         const  {lgosignup, setlgosignup} = React.useContext(SignupContext);
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
    async function fetchOrders(){
         const userEmail = profile.email;
          console.log("email", userEmail);
          const role = 'seller';
          if(!userEmail){
              console.error('User email is missing.');
              return;
          }

          try {
              const response = await fetch(`http://localhost:5000/delorders?email=${encodeURIComponent(userEmail)}&role=${encodeURIComponent(role)}`,
              {
                  headers: {
                      token: localStorage.getItem('authToken'),
                  }
              });
              if(response.status===401){
                alert("Unauthorized access");
                setisLogin(false);
                setlgosignup(false);
        
                navigate('/');
        
              }
              if (!response.ok) {
                  throw new Error(`Failed to fetch orders: ${response.statusText}`);
              }
              const data = await response.json();
              console.log('data',data);
              for(let i=0;i<data.orders.length;i++){
                  data.orders[i].seq=i;
              }
              setOrders(data.orders || []);
          }
          catch (error) {
              console.error('Error fetching orders:', error);
          }

    } 
    useEffect(() => {
        if(profile && profile.email){
            fetchOrders();
        }
    } 
    , [profile,profile.email]);


    function handleOtpInputChange(e, seq){
        setOtp({
            ...otp,
            [seq]: e.target.value,
        });
    }
    async function handleRemoveOrder(seq,id){
          // send a post request
         const payload={orderId:id,otp:otp[seq]}; 
          console.log("payload",payload);
          try{
              const response=await fetch('http://localhost:5000/deliver'
              ,{method:'POST',
              headers:{
                  'Content-Type':'application/json',
                  token:localStorage.getItem('authToken'),
              },
              body:JSON.stringify(payload),
              });
              if(response.status===401){
                alert("Unauthorized access");
                setisLogin(false);
                setlgosignup(false);
        
                navigate('/');
        
              }
              if(response.status===400){
                 alert("Invalid OTP");
                 return;
              }
              if(response.status===404){
                  alert("Order not found");
                  return;
              }

              const data= await response.json();
              console.log('data',data);
              alert('Order delivered successfully');
              setOrders(Orders.filter((order) => order.seq !== seq));

          }
          catch(error){
              console.error('Error:',error);
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
                <a className={active === 'sell' ? 'active' : ''} onClick={() => handleClick('sell')}>
        Sell
        </a>
                {/* <a className={active === 'buy' ? 'active' : ''} onClick={() => handleClick('buy')}>Items</a> */}
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
            <div className="orders-container">
              {Orders.length === 0 && <h2>No orders to deliver</h2>}
        {Orders.map((order) => (
          <div className="order-card" key={order.id}>
            <img
              src={order.productimageurl || "placeholder-image-url.jpg"}
              alt={order.productName}
              className="order-image"
            />
            <div className="order-details">
              <h4>{order.productName}</h4>
              <p>Buyer: {order.buyer}</p>
              <p>Price: ${order.price}</p>
            </div>
            <div className="order-actions">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp[order.seq] || ""}
                onChange={(e) => handleOtpInputChange(e, order.seq)}
              />
              <button
                className="remove-button"
                onClick={() => handleRemoveOrder(order.seq,order._id)}
              >
                Finalise
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DelieverItems
