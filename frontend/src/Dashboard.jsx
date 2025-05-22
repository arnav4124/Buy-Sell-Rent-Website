import React from 'react'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'
import { useNavigate } from "react-router-dom";
import { EmailContext } from './Parent';
import { UsernameContext } from './Parent';
import { LoginContext } from './Parent';
import { set, useForm } from "react-hook-form";
import { ProfileContext } from './Parent';
import { SignupContext } from './Parent';
import './Profile.css'
import { use } from 'react';
const Dashboard = () => {
    const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
          } = useForm();
    const navigate = useNavigate();
    const [active, setActive] = useState(''); // Default active link is 'home'
    const { isLogin, setisLogin } = React.useContext(LoginContext);
    const  {lgosignup, setlgosignup} = React.useContext(SignupContext);
  const handleClick = (section) => {
    setActive(section); // Update the active link
    console.log(section);
    navigate(`/${section}`);
  };
  const { username, setusername } = React.useContext(UsernameContext);
const { email, setemail } = React.useContext(EmailContext);

function hanlelogout(){
  localStorage.removeItem("isLogin");
  localStorage.removeItem("authToken");
  localStorage.removeItem("profile");
  setisLogin(false);
  setlgosignup(false);
   
}
const{profile,setprofile}=React.useContext(ProfileContext);
const [password,setpassword]=useState('');
// const firstname=profile.firstname;
// const lastname=profile.lastname;
// const Email=profile.email;
// const contact=profile.contact;
// const age=profile.age;
// const password=profile.password;

const auth=localStorage.getItem("authToken");
if(!auth){
    navigate('/');
}
console.log('auth:',auth);
async function handleedit(data){
     console.log(data);
     const auth=localStorage.getItem("authToken");
     try{
        const response = await fetch("http://localhost:5000/dashboard", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token:auth
            },
            body: JSON.stringify(data),
          });
    
          const result = await response.json();
          if(response.status===401){
            alert("Unauthorized access");
            setisLogin(false);
            setlgosignup(false);
            navigate('/');}
            if(response.status===400){
                alert("Wrong password");
                return;
            }
          if (response.ok) {
            console.log(result.message); // "logiN successful"
            // Save the JWT token for future authenticated requests
            // localStorage.setItem("authToken", result.token);
              const firstname=result.firstName;
              const Email=result.email;
              const last=result.lastName;
                const contact=result.contact;
                const age=result.age;
                const password=result.password;
              setusername(firstname);
                setemail(Email);
                setprofile({
                    firstname:firstname,
                    lastname:last,
                    email:Email,
                    contact:contact,
                    age:age,
                    password:password
                });
                // store profile on local storage
                localStorage.setItem("profile", JSON.stringify(profile));
                
                console.log('Email:',Email);
                console.log(profile.password);
            setisLogin(true);
            localStorage.setItem("isLogin", "true");
            alert("Profile edited successfully");
            setpassword('');
            // navigate(`/dashboard`);
            
          } else {
            // show an alert message of invalid user
            alert("Invalid user");
    
            console.error(result.message); // "User not found" or "Invalid password"
          }
     }
     catch(error){
         console.error("Error:", error);
     }
}
const [ischangepassword,setischangepassword]=useState(false);
const [oldpassword,setoldpassword]=useState('');
const [newpassword,setnewpassword]=useState('');
async function handlechangepassword(){
      const auth=localStorage.getItem("authToken");
      const useremail=profile.email;
      if(!useremail){
          alert("User email is missing");
          return;
      }
      const payload={email:useremail,oldpassword:oldpassword,newpassword:newpassword};
      console.log(payload);
      try{
           const response=await fetch("http://localhost:5000/changepassword",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    token:auth
                },
                body:JSON.stringify(payload)
            });
            const result=await response.json();
            if(response.status===401 || response.status===403){
              alert("Unauthorized access");
              setisLogin(false);
              setlgosignup(false);
              navigate('/');
            }
            if(response.status===400){
                alert(response.message);
                return;
            }
            if(response.status===404){
                alert(response.message);
                return;
            }
            if(response.status===200){
                alert("Password changed successfully");
                setischangepassword(false);
                setoldpassword('');
                setnewpassword('');
                return;
            }
      }
      catch(error){
          console.error("Error:", error);
      }
}
// localStorage.removeItem((profile.email+'orders'));
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
//               className="forM-control me-2"
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
    <a style={{'colour':"white","fontWeight":"100","fontSize":"18px"}}> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {profile.firstname}</a>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
</svg>
</div>
</div> 
<div className="logiN-container">
      <form className="logiN-form" onSubmit={handleSubmit(handleedit)} >
        <h2 className="logiN-title">Your Profile</h2>

        <div className="forM-group">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            placeholder="Enter your first name"
            defaultValue={profile.firstname}
            className="forM-input"
            {...register("firstName", { required: true })}
            
          />
          {errors.firstName?.type === "required" && (
        <p role="alert" style={{color:'red'}}>First name is required</p>
      )}
        </div>

        <div className="forM-group">    
          <label htmlFor="last-name">Last Name</label>
          <input 
            type="text" 
            id="last-name" 
            name="lastName" 
            defaultValue={profile.lastname}
            required
            placeholder="Enter your last name" 
            className="forM-input"
            {...register("lastName", { required: false ,message : "This field is required"})}
            
          />
        </div>

        <div className="forM-group">
          <label htmlFor="email">Email</label>
          <input 
            type="text"
            id="email" 
            name="email" 
            disabled={true}
            defaultValue={profile.email}
            placeholder="Enter your IIIT email" 
            className="forM-input"
            pattern={"^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$" }
            title="Please enter a valid IIIT email address"
            {...register("email", { required: true ,pattern: /^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$/ })}
            />
            {errors.email?.type === "pattern" && (<p role="alert" style={{color:'red'}}>Please enter a valid IIIT email address</p>)}
        </div>

        <div className="forM-group">
          <label htmlFor="age">Age</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            required 
            defaultValue={profile.age}
            placeholder="Enter your age" 
            className="forM-input"
            min="18" 
            max="100"
            {...register("age", { required: true ,min: 18, max: 100 })}
          />
            {errors.age?.type === "required" && (<p role="alert" style={{color:'red'}}>Age is required</p>)}
            {errors.age?.type === "min" && (<p role="alert" style={{color:'red'}}>Minimum age is 18</p>)}
            {errors.age?.type === "max" && (<p role="alert" style={{color:'red'}}>Maximum age is 100</p>)}
        </div>

        <div className="forM-group">
          <label htmlFor="contact">Contact Number</label>
          <input 
            type="tel" 
            id="contact" 
            name="contact"
            defaultValue={profile.contact} 
            required 
            placeholder="Enter your contact number" 
            className="forM-input"
            pattern="^[0-9]{10}$" 
            title="Please enter a valid 10-digit contact number"
            {...register("contact", { required: true ,pattern: /^[0-9]{10}$/ })}
          />
          {errors.contact?.type === "pattern" && (<p role="alert" style={{color:'red'}}>Please enter a valid 10-digit contact number</p>)}
          {errors.contact?.type === "required" && (<p role="alert" style={{color:'red'}}>Contact number is required</p>)}
        </div>

        <div className="forM-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
  value={password}
  onChange={(e) => setpassword(e.target.value)}
            required
            className="forM-input"
            {...register("password", { required: true,onChange: (e) => setpassword(e.target.value) })}
          />
            {errors.password?.type === "required" && (<p role="alert" style={{color:'red'}}>Password is required</p>)}
        </div>

        <button type="submit" className="logiN-button">
            Edit Profile
        </button>
        <br></br>
        <br></br>
        

      
      </form>

      {!ischangepassword && (
          <>
          <div className="logiN-form">
    <button className='logiN-button' onClick={()=>setischangepassword(true)}>
        Change Password
    </button>
    </div>
    </>
)}
{ischangepassword && (
    <>
    <div className="logiN-form">
    <div className='forM-group'>
        <label htmlFor="oldpassword">Old Password</label>
        <input 
            type='password'
            id='oldpassword'
            name='oldpassword'
            
            placeholder='Enter old password'
            className="forM-input"

            

            value={oldpassword}
            onChange={(e)=>setoldpassword(e.target.value)}

            ></input>
            

        
    </div>

    <div className='forM-group'>
        <label htmlFor='newpassword'>New Password</label>
        <input 
            type='password'
            id='newpassword'
            name='newpassword'
            
            className="forM-input"

            placeholder='Enter new password'
            value={newpassword}
            onChange={(e)=>setnewpassword(e.target.value)}
            ></input>
            </div>
            <button className='logiN-button' onClick={()=>handlechangepassword()}>
              Confirm Change Password
            </button>
            </div>
    </>
       
)}

    </div>
</>

  )
  }

export default Dashboard



