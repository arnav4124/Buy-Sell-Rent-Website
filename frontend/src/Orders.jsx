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
import { SignupContext } from './Parent';
import { set } from 'react-hook-form';
const Orders = () => {
   const navigate = useNavigate();
      const [active, setActive] = useState('');
      const { isLogin, setisLogin } = useContext(LoginContext);
      const { profile,setprofile } = useContext(ProfileContext);
      console.log(profile);
      const { order, setorder } = useContext(OrderContext);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);  
       const [role, setRole] = useState('buyer');
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
  function togglerole(role) {
    setRole(role);
  }
  async function fetchOrders() {
    const userEmail = profile.email;
    console.log("email", userEmail); 
    console.log("role",role);
    // Assuming `profile.email` contains the user's email
    // console.log("email", userEmail);
    // console.log(profile);
    // const role = profile.role; // Assuming `profile.role` contains the user's role (buyer/seller)
    
    if (!userEmail) {
      console.error('User email  is missing.');
      return;
    }
  
    try {
      // Construct query parameters for the GET request
      const auth = localStorage.getItem("authToken");
      // set the auth token in the header
      const response = await fetch(
        `http://localhost:5000/orders?email=${encodeURIComponent(userEmail)}&role=${encodeURIComponent(role)}`,
        {
          method: "GET", // Specify the HTTP method (GET, POST, etc.)
          headers: {
            token: auth, // JWT token
          },
        }
      );

      if(response.status===401){
        alert("Unauthorized access");
        setisLogin(false);
        setlgosignup(false);

        navigate('/');

      }
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
        alert("Failed to fetch orders");
      }
  
      const data = await response.json();
      setorder(data.orders || []);
      const userdet=profile.email+'orders';
      const retrievedList = JSON.parse(localStorage.getItem(userdet));

      if(retrievedList){
        // setorder(JSON.parse(retrievedList));
        console.log("retrievedList",retrievedList);
        for(let i=0;i<retrievedList.length;i++){
          // console.log("product",retrievedList[i].productName);
          // for(let j=0;j<data.orders.length;j++){
          //   if(data.orders[j]._id==retrievedList[i]._id){
          //     data.orders[j].otphashed=retrievedList[i].otphashed;
          //   }
          // }
          data.orders[i].otphashed=retrievedList[i].otphashed;
          data.orders[i].seq=i;
      }
      // for each item in retrievedList, find the corresponding item in data.orders and update the otphashed value in data.orders
    

      setorder(data.orders || []);
     // Assuming `setOrder` is used to update the state of orders
    } 
     
  }
  catch (err) {
      console.error('Error fetching orders:', err);
    }
  }
  
  useEffect(() => {
    if(profile && profile.email){
      fetchOrders();
    }
    // fetchOrders();
  }, [role,profile]);
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
            <div className="toggle-buttons-container">
                <button
                    className={`toggle-button ${(role==='buyer') ? 'active' : ''}`}
                    onClick={() => togglerole('buyer')}
                >
                    Purchsed
                </button>
                <button
                    className={`toggle-button ${(role==='seller') ? 'active' : ''}`}
                    onClick={() => togglerole('seller')}
                >
                    Sold
                </button>
                </div>
                <div className="orders-container">
      <h2>Your Orders ({role === "buyer" ? "Placed" : "Received"})</h2>
      {order.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-grid">
          {order.map((Order, index) => (
            <div key={index} className="order-card">
              <div className="order-thumbnail">
                <img
                  src={Order.productimageurl || "https://via.placeholder.com/100"} // Default placeholder image if no image is provided
                  alt={Order.productName}
                />
              </div>
              <div className="order-details">
                <h3>{Order.productName}</h3>
                <p>
                  <strong>Price:</strong> ${Order.price}
                </p>
                <p>
                  <strong>Status:</strong> {Order.status}
                </p>
                <p>
                  <strong>Ordered On:</strong>{" "}
                  {new Date(Order.orderedon).toLocaleDateString()}
                </p>
                {role === "buyer" && (
                  <p>
                    <strong>Seller:</strong> {Order.seller}
                  </p>
                )}
                {role === "seller" && (
                  <p>
                    <strong>Buyer:</strong> {Order.buyer}
                  </p>
                )}
                {  role==="buyer" && (
                   <p>
                       <strong> Seller Email:</strong> {Order.sellerEmail}
                   </p>
                   
                )}
                {role==="seller" && (
                   <p>
                       <strong> Buyer Email:</strong> {Order.buyerEmail}
                   </p>
                )}
                {/* {role === "buyer" && (}
                <p>
                  <strong>OTP:</strong> {Order.otphashed}
                </p> */}
                {role === "buyer" && (
                  <p>
                    <strong>OTP:</strong> {Order.otphashed}
                  </p>
                )}
              
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}

export default Orders
