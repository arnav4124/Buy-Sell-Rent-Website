import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { EmailContext } from "./Parent";
import { UsernameContext } from "./Parent";
import { ProfileContext } from "./Parent";
import { LoginContext } from './Parent';
import { set } from 'react-hook-form';
const Middash = () => {
    const navigate = useNavigate();
    const { username, setusername } = React.useContext(UsernameContext);
    const { email, setemail } = React.useContext(EmailContext);
    const { profile, setprofile } = React.useContext(ProfileContext);
    const { isLogin, setisLogin } = React.useContext(LoginContext);

  async function verifyToken() {
   const urlParams = new URLSearchParams(window.location.search);
    const token=urlParams.get("token");
    if(token){
        // localStorage.setItem("authToken",token);
    console.log(token);
    try{
        const response = await fetch(`http://localhost:5000/verify?token=${token}`);
        const result = await response.json();
        if (response.ok) {
            console.log(result.message); // "logiN successful"
            // Save the JWT token for future authenticated requests
            localStorage.setItem("authToken", result.token);
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
            // setisLogin(true);
            // localStorage.setItem("isLogin", "true");
            setisLogin(true);
            navigate(`/dashboard`);
          } else {
            // show an alert message of invalid user
            alert("Invalid user");
    
            console.error(result.message); // "User not found" or "Invalid password"
            navigate(`/`);
          }
    }
    catch(error){
        console.error("Error:", error);
    }
     // send a get request
    }
    else{
        console.log("Token not found");
        navigate(`/`);
    }
}

useEffect(() => {
    verifyToken();

}, []);
    // check if params has token

}

export default Middash
