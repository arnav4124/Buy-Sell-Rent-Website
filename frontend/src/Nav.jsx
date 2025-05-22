import { Navigate } from "react-router-dom";
import React from "react";
import { LoginContext } from "./Parent";
// ProtectedRoute component


const ProtectedRoute = ({ children, isLoggedIn }) => {
    // Get the login state from the context
    const { isLogin,setisLogin } = React.useContext(LoginContext);
    const auth=localStorage.getItem("authToken");
    console.log("auth",auth);
    if (!auth) {
      // If the user is not logged in, redirect to login page
      
      return <Navigate to="/" />;
    }
  
    return children;
  };
  export default ProtectedRoute;