import React from 'react'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './Dashboard.css'
import './Sell.css'
import { useNavigate } from "react-router-dom";
import { EmailContext } from './Parent';
import { UsernameContext } from './Parent';
import { LoginContext } from './Parent';
import { useForm } from "react-hook-form";
import { ProfileContext } from './Parent';
import { SignupContext } from './Parent';

const Sell = () => {
  const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
          } = useForm();
    const navigate = useNavigate();
    const [active, setActive] = useState(''); // Default active link is 'home'
    const { isLogin, setisLogin } = React.useContext(LoginContext);
    const {lgosignup, setlgosignup} = React.useContext(SignupContext);

  const handleClick = (section) => {
    setActive(section); // Update the active link
    console.log(section);
    navigate(`/${section}`);
  };
  const { username, setusername } = React.useContext(UsernameContext);
const { email, setemail } = React.useContext(EmailContext);
// for (let i=0;i<10;i++){
//      console.log('Username:',username);
    
// }
function hanlelogout(){
  localStorage.removeItem("isLogin");
  localStorage.removeItem("authToken");
  localStorage.removeItem("profile");
  setisLogin(false);
  setlgosignup(false);
   
}
const{profile,setprofile}=React.useContext(ProfileContext);
// const firstname=profile.firstname;
// const lastname=profile.lastname;
// const Email=profile.email;
// const contact=profile.contact;
// const age=profile.age;
// const password=profile.password;


async function handlesell(data){
     console.log(data);
     data.selleremail=profile.email;
     data.seller=profile.firstname+' '+profile.lastname;
     data.sellercontact=profile.contact;
     const auth = localStorage.getItem("authToken");
     if(!auth)
{
    alert("You are not logged in");
    return;
}      try{
          const response = await fetch("http://localhost:5000/sell", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: auth,
              },
              body: JSON.stringify(data),
            });
      
            const result = await response.json();
            if(response.status===401){
              alert("Unauthorized access");
              setisLogin(false);
              setlgosignup(false);
      
              navigate('/');
      
            }
            if (response.ok) {
              console.log(result.message); // "Login successful"
              alert("Item added successfully");
            } else {
              // show an alert message of invalid user
              alert("Unamble to add item");
      
              console.error(result.message); // "User not found" or "Invalid password"
            }
      }
      catch(error){
          console.error("Error:", error);
      }
  }
      return (
      
  //     <div>
  //   <nav className="navbar navbar-expand-lg bg-body-tertiary">
  //     <div className="container-fluid">
  //       <a className="navbar-brand" href="#">Navbar</a>
  //       <button
  //         className="navbar-toggler"
  //         type="button"
  //         data-bs-toggle="collapse"
  //         data-bs-target="#navbarSupportedContent"
  //         aria-controls="navbarSupportedContent"
  //         aria-expanded="false"
  //         aria-label="Toggle navigation"
  //       >
  //         <span className="navbar-toggler-icon"></span>
  //       </button>
  //       <div className="collapse navbar-collapse" id="navbarSupportedContent">
  //         <div className="d-flex justify-content-between w-100">
  //           {/* Centered Navigation Links */}
  //           <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
  //             <li className="nav-item">
  //               <a className="nav-link active" aria-current="page" href="#">Home</a>
  //             </li>
  //             <li className="nav-item">
  //               <a className="nav-link" href="#">Link</a>
  //             </li>
  //             <li className="nav-item dropdown">
  //               <a
  //                 className="nav-link dropdown-toggle"
  //                 href="#"
  //                 role="button"
  //                 data-bs-toggle="dropdown"
  //                 aria-expanded="false"
  //               >
  //                 Dropdown
  //               </a>
  //               <ul className="dropdown-menu">
  //                 <li><a className="dropdown-item" href="#">Action</a></li>
  //                 <li><a className="dropdown-item" href="#">Another action</a></li>
  //                 <li><hr className="dropdown-divider" /></li>
  //                 <li><a className="dropdown-item" href="#">Something else here</a></li>
  //               </ul>
  //             </li>
  //             <li className="nav-item">
  //               <a className="nav-link disabled" aria-disabled="true">Disabled</a>
  //             </li>
  //           </ul>

  //           {/* Centered Search Bar */}
  //           <form className="d-flex mx-auto" style={{ maxWidth: '400px', flex: 1 }}>
  //             <input
  //               className="form-control me-2"
  //               type="search"
  //               placeholder="Search"
  //               aria-label="Search"
  //             />
  //             <button className="btn btn-outline-success" type="submit">Search</button>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   </nav>
  // </div>

<>
 <div className="topnav">
    <a  className={active === 'logout' ? 'active' : ''} onClick={hanlelogout}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
    Logout
    </a>

        <a
        className={active === 'sell' ? 'active' : ''}
      
        onClick={() => handleClick('sell')}
      >
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
  {/* <div className="search-container">
    <form action="/action_page.php">
      <input type="text" placeholder="Search.." name="search"/>
      <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>              </button>
    </form>
  </div> */}
  <a
      className={active === 'search' ? 'active' : '' }onClick={() => handleClick('search')}
      >
        Search &nbsp;&nbsp;  
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg> 
        </a>
  
 <div className='profile'>
    <a  onClick={()=>handleClick('dashboard')}> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {profile.firstname}
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>

</svg>
</a>
</div>
</div> 
<div className="Login-container">
      <form className="Login-Form" onSubmit={handleSubmit(handlesell)}>
        <h2 className="Login-title">Sell an Item</h2>

        <div className="Form-group">
          <label htmlFor="email">Item Name</label>
          <input  
            type="text" 
            id="email" 
            name="email" 
            required 
            placeholder="Enter your item name" 
            {...register("item", { required: true })}
            className="Form-input"
          />
        </div>

        <div className="Form-group">
          <label htmlFor="password">Description</label>
          <textarea
    id="description"
    name="description"
    required
    {...register("description", { required: true })}
    placeholder="Enter your product description"
    className="Form-input"
    rows="4" // Adjust the number of rows as needed
    cols="50" // Adjust the width as needed
  ></textarea>
        </div>
    
        <div className="Form-group"  
        > 

        <label htmlFor="category">Category</label>
        <select 
            id="category" 
            name="category" 
            required 
            {...register("category", { required: true })}
            className="Form-input">
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            <option value="Books">Books</option>
            <option value="Others">Others</option>
            </select>


          </div>
        <div className="Form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            required
            {...register("price", { required: true ,min: 0 })}
            placeholder="Enter price"
            className="Form-input"
          />
           {errors.price?.type === "min" && (<p role="alert" style={{color:'red'}}>Price should be greater than 0</p>)}
           {errors.price?.type === "required" && (<p role="alert" style={{color:'red'}}>Please enter a positive price</p>)}
        </div>
       {/* take file inut for image  */}
       {/* <div className="form-group custom-file-input"> */}
       <div className="Form-group"  
                                  > 
  {/* <label htmlFor="image">Image</label>
  <input
    type="file"
    id="image"
    name="image"
    required
    {...register("image", { required: true })}
    placeholder="Enter image"
    className="form-input hidden-file-input"
    onChange={(e) => {
      const fileName = e.target.files[0]?.name || "No file chosen";
      const fileLabel = document.getElementById("file-name");
      fileLabel.textContent = fileName;
      fileLabel.style.color = fileName === "No file chosen" ? "red" : "black";
    }}
  /> */}
  {/* <label for="formFileLg" class="form-label">Large file input example</label>
  <input class="form-control form-control-lg" id="formFileLg" type="file" style={{"color": "#c40c53"}}
    {...register("image", { required: true })}
  ></input> */}
  {/* <span id="file-name" className="file-name" style={{ color: "red" }}>
    No file chosen
  </span> */}
   <label htmlFor="imageurl">Image_url</label>
          <input  
            type="text" 
            id="imageurl" 
            name="imageurl" 
            required 
            placeholder="Enter your product imageURL" 
            {...register("imageurl", { required: true })}
            className="Form-input"
          />
</div>
        <button type="submit" className="Login-button">
          Sell
        </button>
       
      </form>
    </div>
</>

  )
}

export default Sell
