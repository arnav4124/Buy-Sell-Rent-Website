import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import "./Login.css";
// import App from "./App";
// import Dashboard from "./Dashboard";
import { set } from "react-hook-form";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component
import { EmailContext } from "./Parent";
import { UsernameContext } from "./Parent";
import { ProfileContext } from "./Parent";
const Login = ({isLogin,setisLogin,lgosignup, setlgosignup}) => {
    const navigate = useNavigate();
    const { username, setusername } = React.useContext(UsernameContext);
    const { email, setemail } = React.useContext(EmailContext);
    const { profile, setprofile } = React.useContext(ProfileContext);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    // const [isLogin,SetisLogin] = useState(false);
  
        const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
          } = useForm()
    

const handleRecaptchaChange = (token) => {
  setRecaptchaToken(token);
};
const onSubmit = async (data, event) => {
    event.preventDefault();
   
    console.log("Form submitted");
    console.log(data);
    data.type=1;
    console.log('email:', data.email);

    // Send a POST request to the backend
    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // "Login successful"
        // Save the JWT token for future authenticated requests
        // localStorage.setItem("authToken", result.token);
        localStorage.setItem("authToken", result.token);
          const firstname=result.name;
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
        setisLogin(true);
        localStorage.setItem("isLogin", "true");
        navigate(`/dashboard`);
        
      } else {
        // show an alert message of invalid user
        alert("Invalid user");

        console.error(result.message); // "User not found" or "Invalid password"
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
 const  handleswitch=()=>{
    // setlgosignup(true);
    navigate('/signup');

  };
  async function handleCAS(e){
       // send a get request
        e.preventDefault();
      try{
          const response=await fetch('http://localhost:5000/cas/login');
          if(response.status===400){
              alert("Invalid OTP");
          }
          const result = await response.json();
          if(response.ok){
            // if(response.loginUrl){
            //   console.log("loginurl",response.loginUrl);}
            //  else{
            //     console.log("chud gaye guru");
            //  }
             window.location.href = result.loginUrl;    
              // console.log("response",response);
              // const result=await response.json();
              // console.log("result",result);
              // const firstname=result.name;
              // const Email=result.email;
              // const last=result.lastName;
              // const contact=result.contact;
              // const age=result.age;
              // const password=result.password;
              // const token=result.token;
              // setusername(firstname);
              // setemail(Email);
              // setprofile({
              //     firstname:firstname,
              //     lastname:last,
              //     email:Email,
              //     contact:contact,
              //     age:age,
              //     password:password
              // });
              // // store profile on local storage
              // localStorage.setItem("profile", JSON.stringify(profile));
              // setisLogin(true);
              // localStorage.setItem("isLogin", "true");
              // localStorage.setItem("authToken", token);
              // navigate(`/dashboard`);
          }
  }
  catch(error){
      console.error('Error:',error);
  }
}
  return (
    <>
    <div className="navbaR">
                   <div className="company-name">ShopSpot</div>
</div>
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-title">Welcome Back</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="Enter your email" 
            {...register("email", { required: true })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            {...register("password", { required: true })}
            placeholder="Enter your password"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <ReCAPTCHA
            sitekey="6LcPXb0qAAAAAAN9m6yiGWojS2Q4TKSipSK8LjrA" // Replace with your Google reCAPTCHA Site Key
            onChange={handleRecaptchaChange}
          />
        </div>
       <div className='button-containeR'>
        <button type="submit" className="login-button">
          Login
        </button>

        <br></br>
        <button  className="login-button" onClick={(e)=>handleCAS(e)}>
          Login With CAS 
        </button>
     
        
        </div>
        <p className="forgot-password">New User? <a style={{color:"blue"}} onClick={handleswitch}><u>Sign Up</u></a></p>
      </form>
      
    </div>
    </>
  )




}

export default Login;