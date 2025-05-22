import React from 'react'
import ProtectedRoute from './Nav'
import App from './App'
import Items from './Items'
import Dashboard from './Dashboard'
import MyCart from './MyCart'
import Orders from './Orders'
import DelieverItems from './DelieverItems' 
import Sell from './Sell'
import Search from './Search'
import { useEffect } from 'react'
import Support from './Support'
import Middash from './Middash'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Signup from './Signup'
import './Parent.css'
// create context for login
const LoginContext = React.createContext()
const UsernameContext = React.createContext()
const EmailContext = React.createContext()
const ProfileContext = React.createContext();
const CartContext=React.createContext();
const OrderContext=React.createContext();
const SignupContext=React.createContext();

const Parent = () => {
    
    const [isLogin, setisLogin] = React.useState(() => {
        return localStorage.getItem("isLogin") === "true"; // Retrieve the login state from localStorage
      });
    
    const [username, setusername] = React.useState('');
    const [email, setemail] = React.useState('');
    const[order,setorder]=React.useState([]);
      const [lgosignup, setlgosignup] = React.useState(false);
    
    
      React.useEffect(() => {
        localStorage.setItem("isLogin", isLogin); // Persist the state whenever it changes
      }, [isLogin]);
     const [profile,setprofile]=React.useState({
        firstname:'',
        lastname:'',
        email:'',
        contact:'',
        age:'',
        password:'',
     });
     const [cart,setcart]=React.useState([]);
     useEffect(() => {
        // Check if profile data exists in localStorage
        const savedProfile = JSON.parse(localStorage.getItem("profile"));
        
        const savedorder=JSON.parse(localStorage.getItem("order"));
        // if cart data exists in localStorage, update the state with it
          var cart=JSON.parse(localStorage.getItem("cart"));
          if (cart) {
            setcart(cart);
          }
        // If data exists in localStorage, update the state with it
        if (savedProfile) {
          setprofile(savedProfile);
        }
      }, []); // Empty dependency array to run this only once on component mount
    
      // Optionally, you can update localStorage when profile state changes
      useEffect(() => {
        if (profile.firstname) {
          localStorage.setItem("profile", JSON.stringify(profile));
        }
      }, [profile]);
  const  router=createBrowserRouter([
        {
          path:'/',
          element:<App isLogin={isLogin} setisLogin={setisLogin} lgosignup={lgosignup} setlgosignup={setlgosignup} />
      
        },
        {
          path:'/middash',
          element:<Middash/>
        },
        {
          path:'/sell',
          element:<ProtectedRoute isLoggedIn={isLogin}>
            <Sell/>
          </ProtectedRoute>
        },
        {
           path:'/buy',
           element: <ProtectedRoute isLoggedIn={isLogin}>
           <Items/>
            </ProtectedRoute>
        },
        {
          path:'/dashboard',
          element:<ProtectedRoute isLoggedIn={isLogin}>
          <Dashboard/>
          </ProtectedRoute>
        },
        {
           path:'/signup',
            element:<Signup/>
        }
        ,
        {
            path:'/mycart',
            element: <ProtectedRoute isLoggedIn={isLogin}>
            <MyCart/>
            </ProtectedRoute>
        },
        {
          path: '/ord',
          element: <ProtectedRoute isLoggedIn={isLogin}>
          <Orders />
          </ProtectedRoute>
        },
        {
          path: '/sold',
          element:<ProtectedRoute isLoggedIn={isLogin}>
           <DelieverItems />
          </ProtectedRoute>
        },
        {
          path:'/search',
          element:<ProtectedRoute isLoggedIn={isLogin}>
            <Search/>
          </ProtectedRoute>
        },
        {
            path: 'search/:id',
            element: <ProtectedRoute isLoggedIn={isLogin}>
              <Items />
            </ProtectedRoute>
        }
        ,
        {
            path: '/support',
            element: <ProtectedRoute isLoggedIn={isLogin}>
              <Support />
            </ProtectedRoute>
        }
        
        // {
        //   path:'/ai_support',
        //   element:<AI_support/>
        // }
      
      ])

  return (

      <div>
        <SignupContext.Provider value={{lgosignup,setlgosignup}}>
        <OrderContext.Provider value={{order,setorder}}>
        <CartContext.Provider value={{cart,setcart}}> 
        <ProfileContext.Provider value={{profile,setprofile}}>
        <EmailContext.Provider value={{email,setemail}}>
        <UsernameContext.Provider value={{username,setusername}}>
        <LoginContext.Provider value={{isLogin,setisLogin}}>
          <RouterProvider router={router}/>
    </LoginContext.Provider>
    </UsernameContext.Provider>
    </EmailContext.Provider>
    </ProfileContext.Provider>
    </CartContext.Provider>
    </OrderContext.Provider>
    </SignupContext.Provider>
    </div>
  
  )
}

export default Parent
export {LoginContext}
export {UsernameContext}
export {EmailContext}
export {ProfileContext}
export {CartContext}
export {OrderContext}
export {SignupContext}