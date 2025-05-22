import React from "react";
import ReactDOM from "react-dom"
import "./Login.css"; // Import the CSS file
import { useForm } from "react-hook-form"
import { EmailContext } from "./Parent";
import { UsernameContext } from "./Parent";
import { ProfileContext } from "./Parent";
import { LoginContext } from "./Parent";
import { useNavigate } from "react-router-dom";
const Signup = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()
      const { profile, setprofile } = React.useContext(ProfileContext);
//   function onSubmit(data) {

//     console.log(data);
//     setisLogin(true);
//   }
const navigate = useNavigate();
const { username, setusername } = React.useContext(UsernameContext);
const { email, setemail } = React.useContext(EmailContext);
const { isLogin, setisLogin } = React.useContext(LoginContext);
const onSubmit = async (data) => {
    console.log("Form submitted");
    console.log(data);
    
    data.type=2;
    try {
      const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if(response.status===400){
        alert("email already registerd");
      }
      if (response.ok) {
        console.log(result.message); // "Signup successful"
        // Save the JWT token for future authenticated requests
        const name=result.firstName;
        const lastname=result.lastName;
        const Email=result.email;
        const contact=result.contact;
        const age=result.age;
        const password=result.password;
     
        setusername(username);
          setemail(Email);
            setprofile({
                firstname:name,
                lastname:lastname,
                email:Email,
                contact:contact,
                age:age,
                password:password
            });
        // store profile on local storage
        localStorage.setItem("profile", JSON.stringify(profile));
        localStorage.setItem("authToken", result.token);
        setisLogin(true);  // Successfully signed up, now log the user in
        localStorage.setItem("isLogin", "true");
        navigate(`/dashboard`);
      } else {
        console.error(result.message); // e.g., "User already exists"
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  function handleswitch(){
    //  setlgosignup(false);
    navigate('/');

  }


  return (
    <>
    <div className="navbaR">
                   <div className="company-name">ShopSpot</div>
</div>
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="login-title">Create an Account</h2>

        <div className="form-group">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            placeholder="Enter your first name"
            
            className="form-input"
            {...register("firstName", { required: true })}
            
          />
          {errors.firstName?.type === "required" && (
        <p role="alert" style={{color:'red'}}>First name is required</p>
      )}
        </div>

        <div className="form-group">    
          <label htmlFor="last-name">Last Name</label>
          <input 
            type="text" 
            id="last-name" 
            name="lastName" 
            required
            placeholder="Enter your last name" 
            className="form-input"
            {...register("lastName", { required: false ,message : "This field is required"})}
            
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="text"
            id="email" 
            name="email" 
            
            placeholder="Enter your IIIT email" 
            className="form-input"
            pattern={"^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$" }
            title="Please enter a valid IIIT email address"
            {...register("email", { required: true ,pattern: /^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$/ })}
            />
            {errors.email?.type === "pattern" && (<p role="alert" style={{color:'red'}}>Please enter a valid IIIT email address</p>)}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input 
            type="number" 
            id="age" 
            name="age" 
            required 
            placeholder="Enter your age" 
            className="form-input"
            min="18" 
            max="100"
            {...register("age", { required: true ,min: 18, max: 100 })}
          />
            {errors.age?.type === "required" && (<p role="alert" style={{color:'red'}}>Age is required</p>)}
            {errors.age?.type === "min" && (<p role="alert" style={{color:'red'}}>Minimum age is 18</p>)}
            {errors.age?.type === "max" && (<p role="alert" style={{color:'red'}}>Maximum age is 100</p>)}
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input 
            type="tel" 
            id="contact" 
            name="contact" 
            required 
            placeholder="Enter your contact number" 
            className="form-input"
            pattern="^[0-9]{10}$" 
            title="Please enter a valid 10-digit contact number"
            {...register("contact", { required: true ,pattern: /^[0-9]{10}$/ })}
          />
          {errors.contact?.type === "pattern" && (<p role="alert" style={{color:'red'}}>Please enter a valid 10-digit contact number</p>)}
          {errors.contact?.type === "required" && (<p role="alert" style={{color:'red'}}>Contact number is required</p>)}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="Enter your password"
            className="form-input"
            {...register("password", { required: true })}
          />
            {errors.password?.type === "required" && (<p role="alert" style={{color:'red'}}>Password is required</p>)}
        </div>

        <button type="submit" className="login-button">
          Sign Up
        </button>
        <p className="forgot-password">Already have an account? <a  onClick={handleswitch} style={{color:'blue'}}><u>Log in </u></a></p>
      </form>
    </div>
    </>
  );
};

export default Signup;