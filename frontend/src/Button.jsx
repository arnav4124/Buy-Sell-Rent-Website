import React from 'react'
// import Button from 'react-bootstrap/Button';   
import './Button.css'
const Button = ({text}) => {
    var style = {'vertical-align': 'middle'};
  return (
    <div>
      <button className="button" style={style} ><span>{text} </span></button>
    </div> 
  )
}

export default Button
