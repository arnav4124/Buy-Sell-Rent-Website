import React from 'react'
import { useState , useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'
import { useNavigate } from "react-router-dom";
import { EmailContext } from './Parent';
import { UsernameContext } from './Parent';
import { LoginContext } from './Parent';
import { set, useForm } from "react-hook-form";
import { ProfileContext } from './Parent';
import { CartContext } from './Parent';
import { SignupContext } from './Parent';
import './Profile.css'
import './MyCart.css'
import { use } from 'react';
const MyCart = () => {
   const navigate = useNavigate();
      const [active, setActive] = useState(''); // Default active link is 'home'
      const { isLogin, setisLogin } = React.useContext(LoginContext);
  
    const handleClick = (section) => {
      setActive(section); // Update the active link
      console.log(section);
      navigate(`/${section}`);
    };
    const { username, setusername } = React.useContext(UsernameContext);
  const { email, setemail } = React.useContext(EmailContext);
   const { cart, setcart } = React.useContext(CartContext);
   const [total, settotal] = useState(0);
       const  {lgosignup, setlgosignup} = React.useContext(SignupContext);
   
  function hanlelogout(){
    localStorage.removeItem("isLogin");
    localStorage.removeItem("authToken");
    localStorage.removeItem("profile");
    setisLogin(false);

    setlgosignup(false);

     
  }
  const{profile,setprofile}=React.useContext(ProfileContext);
  // const emailid=profile.email;  
  console.log(profile);
  const [cartitems, setcartitems] = useState([]); 
  // console.log(profile.email);
  async function fetchcartproducts() {
    // console.log("email", emailid);
    const userEmail = profile.email; // Assuming `profile.email` contains the user's email
    if (!userEmail) {
      console.error('User email is missing.');
      // console.log("bhadve---->", userEmail);
      return;
    } 
  
    try {
      const auth = localStorage.getItem("authToken");
      // Use query parameters to pass the email for a GET request
      const response = await fetch(`http://localhost:5000/cart?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: auth,
        },
      });
      if(response.status===401){
        alert("Unauthorized access");
        setisLogin(false);
        setlgosignup(false);

        navigate('/');

      }
      if (!response.ok) {
        throw new Error(`Failed to fetch cart products: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Update cart items
      if (data.products && data.products.length > 0) {
        setcartitems(data.products); // Assuming `data.products` contains the product list
        // console.log("cartitems",data.products);
        // Calculate and set the total price
        const totalPrice = data.products.reduce((acc, product) => acc + product.price, 0);
        // console.log("totalPrice",totalPrice);
        settotal(totalPrice);
      } else {
        setcartitems([]);
        settotal(0); // No products in the cart, so total is 0
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }
  
  async function handlePlaceOrder(){
         const userEmail = profile.email; // Assuming `profile.email` contains the user's email
    if (!userEmail) {
      console.error('User email is missing.');
      return;
    }
        const payload = {buyerEmail:userEmail,cartItems:cartitems};
        console.log("payload",payload);
    try{
         const auth = localStorage.getItem("authToken");
         const response = await fetch('http://localhost:5000/placeorder', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          token: auth,
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
        throw new Error(`Failed to place order: ${response.statusText}`);
        alert("Failed to place order");
      }
      const data = await response.json();
      console.log("le le data",data.orders[0]);
      const userdet=profile.email+'orders';
      const savedorders=localStorage.getItem(userdet);
      if(!savedorders){ 
        console.log("khali hai");
        localStorage.setItem(userdet,JSON.stringify(data.orders));

      }
      else{
        console.log("bhara hai");
        const Orders=JSON.parse(savedorders);
        console.log("savedorders",Orders);
        for(let i=0;i<data.orders.length;i++){
          Orders.push(data.orders[i]);
        }
        // Orders.push(data.orders); 
        console.log("after pushoing",Orders);
        localStorage.setItem(userdet,JSON.stringify(Orders));
      }
      setcartitems([]);
      settotal(0);
      alert("Order placed successfully");
4
    }
    catch(err){
      console.error('Error placing order:', err);
    }
  }
  function handleRemoveFromCart(id){
    const newcart=cart.filter((item)=>item._id!==id);
    setcart(newcart);
  }
  useEffect(() => {
    if(profile && profile.email){
    fetchcartproducts();
    }
  },[profile] );
  async function handleRemoveFromCart(productId,price) {
    if (!profile.email) {
      console.error('User email is missing.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('authToken'), 
        },
        body: JSON.stringify({
          userEmail: profile.email,
          productId,
        }),
      });
      if(response.status===401){
        alert("Unauthorized access");
        setisLogin(false);
        setlgosignup(false);

        navigate('/');

      }
      if (!response.ok) {
        alert("Failed to remove product from cart");
        throw new Error(`Failed to remove product: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Update cart items and total price
      if (data.products) {
        setcartitems(data.products);
  
        // const totalPrice = data.products.reduce((acc, product) => acc + product.price, 0);
        const totalPrice = data.products.reduce((acc, product) => acc + product.price, 0);
        settotal(totalPrice);
      }
    } catch (err) {
      console.error('Error removing product from cart:', err);
    }
  }
  
  return (
    <div>
       <div className="topnav">
    <a  className={active === 'logout' ? 'active' : ''} onClick={hanlelogout}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
    Logout
    </a>
  
    <a className={active === 'sell' ? 'active' : ''} onClick={() => handleClick('sell')}>
        Sell
        </a>
        <a
        className={active === 'mycart' ? 'active' : ''}
       
        onClick={() => handleClick('mycart')}
      >
        MyCart
        </a>   
        <a
        className={active === 'ord' ? 'active' : ''}
       
        onClick={() => handleClick('ord')}
      >
        MyOrders
        </a>   
        <a
        className={active === 'sold' ? 'active' : ''}
       
        onClick={() => handleClick('sold')}
      >
        SoldItems
        </a>
        <a className={active === 'support' ? 'active' : ''} onClick={() => handleClick('support')}>
        Support
        </a>
  {/* <div className="search-container">
    <form action="/action_page.php">
      <input type="text" placeholder="Search.." name="search"/>
      <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>              </button>
    </form>
  </div> */}
  <a
      className={active === 'seaarch' ? 'active' : '' }onClick={() => handleClick('search')}
      >
        Search &nbsp;&nbsp;  
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg> 
        </a>
  
 <div className='profile'>
    <a style={{'colour':"white","fontWeight":"100","fontSize":"18px"}} onClick={()=> handleClick('dashboard')}> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {profile.firstname}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
</svg>
    </a>
</div>
</div> 
<div className="cart-container">
        <h2 style={{"textAlign":"center"}}>My Cart</h2>
        {cartitems.length === 0 ? (
          <p></p>
        ) : (
          <div>
            {cartitems.map(item => (
              <div className="cart-item" key={item._id}>
                <img src={item.imageUrl } alt={item.productName} className="thumbnail" />
                <div className="details">
                  <h3>{item.productName}</h3>
                  <p>Rs {item.price}</p>
                  <button onClick={() => handleRemoveFromCart(item._id,item.price)} className="remove-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
       
        <div className="cart-footer">
          {total > 0 && (
            <div>
          <h3>Total Price: Rs {total}</h3> 
  <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
  </div>
)}
{total === 0 && <p>Your cart is empty</p>}

        </div>
      </div>
    </div>
    
 
 
  )
}

export default MyCart
