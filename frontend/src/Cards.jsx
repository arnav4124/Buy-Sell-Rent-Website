import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cards.css';

const Card = ({ name, category, seller,image,price ,_id}) => {
  const  navigate  = useNavigate();
 function handleClick(type,id){
    navigate(`/search/${id}`);
  }
  return (
    <>
    <div className="card" key={_id}>
      < a onClick={()=> handleClick('item',_id)}>
      <div className="card-header">
        <img
          src={image}
          alt={name}
          className="card-image"
        />
        
      </div>
    </a>
      <div className="card-body">
        <span className="tag">{category}</span>
        <h4 className="card-title">{name}</h4>
        <h4 className="card-price">Price: Rs {price} /-</h4> 
        <p className="card-seller">Seller: {seller}</p>
      </div>
    </div>
      </>
  );
};

export default Card;
