// import React, { useEffect, useState } from "react";
// import './App.css'
// const ShopSpot = () => {
//   const [text, setText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const originalText = "Welcome To SHOPSPOT!!";

//   useEffect(() => {
//     let index = text.length;
//     const type = () => {
//       if (isDeleting) {
//         if (index > 0) {
//           setText((prev) => prev.slice(0, -1));
//         } else {
//           setIsDeleting(false);
//         }
//       } else {
//         if (index < originalText.length) {
//           setText((prev) => prev + originalText[index]);
//         } else {
//           setIsDeleting(true);
//         }
//       }

//       const speed = isDeleting ? 100 : 200;
//       setTimeout(type, speed);
//     };

//     type();
//   }, [text, isDeleting]);

//   const redirectTo = (url) => {
//     window.location.href = url;
//   };

//   return (
//     <div className="container">
//       <div className="left-outside">
//         <div id="text">{text}|</div>
//         <div className="left-side"></div>
//         <div id="text2">
//           <span className="p">S</span>hop from your doorstep
//         </div>
//       </div>
//       <div className="right-side">
//         <form
//           id="button1"
//           onSubmit={(e) => {
//             e.preventDefault();
//             redirectTo("login.html");
//           }}
//         >
//           <button className="button-container">Login</button>
//         </form>
//         <form
//           id="button2"
//           onSubmit={(e) => {
//             e.preventDefault();
//             redirectTo("signup.html");
//           }}
//         >
//           <button className="button-container2">Signup</button>
//         </form>
//         <form
//           id="button3"
//           onSubmit={(e) => {
//             e.preventDefault();
//             redirectTo("adminlogin.html");
//           }}
//         >
//           <button className="button-container3">Admin Login</button>
//         </form>
//       </div>
//       <div className="footer">
//         © VIDPRO 2024
//         <br />
//         Created by: Arnav Deshmukh
//       </div>
//     </div>
//   );
// // };

// // export default ShopSpot;

// import React, { useEffect, useState } from "react";
// import "./App.css";

// const ShopSpot = () => {
//   const [text, setText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);
//   const originalText = "Welcome To SHOPSPOT!!";

//   useEffect(() => {
//     // let index = text.length;
//     // const type = () => {
//     //   if (isDeleting) {
//     //     if (index > 0) {
//     //       setText((prev) => prev.slice(0, -1));
//     //     } else {
//     //       setIsDeleting(false);
//     //     }
//     //   } else {
//     //     if (index < originalText.length) {
//     //       setText((prev) => prev + originalText[index]);
//     //     } else {
//     //       setIsDeleting(true);
//     //     }
//     //   }

//     //   const speed = isDeleting ? 100 : 200;
//     //   setTimeout(type, speed);
//     // };

//     // const timer = setTimeout(type, isDeleting ? 100 : 200);
//     // return () => clearTimeout(timer);
//   }, [text, isDeleting]);

//   const redirectTo = (url) => {
//     window.location.href = url;
//   };

//   return (
//     <>
//     <div className="container">
//       {/* Left Section */}
//       <div className="left-outside">
//         <div id="text">{text}|</div>
//         <div className="left-side"></div>
//         <div id="text2">
//           <span className="p">S</span>hop from your doorstep
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="right-side">
//         <button
//           className="button-container"
//           onClick={() => redirectTo("login.html")}
//         >
//           Login
//         </button>
//         <button
//           className="button-container2"
//           onClick={() => redirectTo("signup.html")}
//         >
//           Signup
//         </button>
//         <button
//           className="button-container3"
//           onClick={() => redirectTo("adminlogin.html")}
//         >
//           Admin Login
//         </button>
//       </div>

//       {/* Footer */}
//       <div className="footer">
//         © VIDPRO 2024
//         <br />
//         Created by: Arnav Deshmukh
//       </div>
//     </div>
//     </>
//   );
// };

// export default ShopSpot;

import React from "react";
import "./App.css";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Signup from "./Signup.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';


import Button from "./Button";
const App = ({isLogin, setisLogin,lgosignup,setlgosignup}) => {


  if(isLogin){
    return <Dashboard/>
  }
  const authToken=localStorage.getItem("authToken");
  if ((!isLogin && !lgosignup) ) {
    return (
    
    <div>
      
    <Login isLogin={isLogin} setisLogin={setisLogin} lgosignup={lgosignup} setlgosignup={setlgosignup}/>
    </div>

    )
  }
  // if(!isLogin && lgosignup ){
  //   return <Signup isLogin={isLogin} setisLogin={setisLogin} lgosignup={lgosignup} setlgosignup={setlgosignup}/>
  // }
  // ret  urn (
  //   <div className="container">
  //     {/* Main Content */}
  //     <div className="content">
  //       {/* Left Section */}
  //       <div className="left-section">
         
  //       </div>

  //       {/* Right Section */}
  //       <div className="right-section">
  //         <div className="button-container">


  //         <Button text="Login" />
  //         <br></br>
  //         <br></br>
  //         <br></br>
  //           <Button text="Signup" />
  //         </div>
  //       </div>
  //     </div>

  //     {/* Footer */}
  //     <div className="footer">
  //       <p>© 2025 Shopspot. All rights reserved.</p>
  //     </div>
  //   </div>
  // );
};

export default App;
