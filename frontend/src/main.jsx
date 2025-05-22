import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import { useState } from 'react'
// import { useNavigate } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import Dashboard from './Dashboard.jsx'
import Items from './Items.jsx'
import MyCart from './MyCart.jsx'
import Orders from './Orders.jsx'
import SoldItems from './DelieverItems.jsx'
import Parent from './Parent.jsx'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Parent/>

   
  // </StrictMode>,
)
