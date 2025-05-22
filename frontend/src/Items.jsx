import React, { useEffect, useState } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';
import './Items.css';
import { LoginContext } from './Parent';
import { ProfileContext } from './Parent';
import { useContext } from 'react';
import './Dashboard.css';
import { CartContext } from './Parent';
const Items = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [active, setActive] = useState('');
  const { isLogin, setisLogin } = useContext(LoginContext);
  const { profile } = useContext(ProfileContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]); // Store fetched items
  const [filteredItems, setFilteredItems] = useState([ 
    { name: 'Product 1', category: 'Electronics', seller: 'John Doe', imageurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlf8zPUH9D4H-PZo9z_TeMM45jRZgHrjVzkg&s" },
    { name: 'Product 2', category: 'Clothing', seller: 'Jane Smith', imageurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZzZZzPq8u4s123434343&s" },
    { name: 'Product 3', category: 'Books', seller: 'Alice Johnson', imageurl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT10QB1j9Df1R7K6fax2E8wqqTIrYlZgNAsJg&s" },
]); // Store filtered items
  const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    try {
        const response = await fetch('http://localhost:5000/products/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categories: selectedCategories, searchQuery }), // Send selected categories and search query
        });
        const data = await response.json();
        const list = data.map((item) => ({
            name: item.productName,
            category: item.category,
            seller: item.seller,
            imageurl: item.imageUrl,
            price: item.price,
            _id: item._id,
        }));
        setItems(data);
        setFilteredItems(list);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Fetch all products on component mount or when filters/searchQuery change
useEffect(() => {
    fetchProducts();
}, [selectedCategories, searchQuery]);

const handleSearchChange = (e) => {
  setSearchQuery(e.target.value); // Update the search query
};

  // Fetch all products on component mount

  // Function to handle category toggling
  const toggleCategory = (category) => {
      let updatedCategories;
      if (selectedCategories.includes(category)) {
          // If category is already selected, remove it
          updatedCategories = selectedCategories.filter((c) => c !== category);
      } else {
          // If category is not selected, add it
          updatedCategories = [...selectedCategories, category];
      }
      setSelectedCategories(updatedCategories);

      // Filter products based on updated selected categories
      if (updatedCategories.length === 0) {
          setFilteredItems(items); // Show all items if no categories are selected
      } else {
          setFilteredItems(items.filter((item) => updatedCategories.includes(item.category)));
      }
  };

  const handleClick = (section) => {
      setActive(section);
      navigate(`/${section}`);
  };

  const handleLogout = () => {
      setisLogin(false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("authToken");
      localStorage.removeItem("profile");
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/search/${id}`, {
          method: 'GET', // Explicitly specifying the request method
          headers: {
            'Content-Type': 'application/json', // Specify the content type, if required
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!product) return <div>Loading...</div>;
const  {cart, setcart}=useContext(CartContext);
function addtocart() {
  // Include the user's email in the request payload
  const payload = {
    userEmail: profile.email, // Assuming `profile.email` contains the user's email
    product,
  };

  // Send a POST request to the backend to add the product to the cart
  fetch('http://localhost:5000/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }
      return response.json();
    })
    .then((data) => {
      alert('Product added to cart successfully');
      console.log('Cart updated:', data.cart);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Failed to add product to cart');
    });
}
  return (
    <>
     <div className="topnav">
                <a className={active === 'logout' ? 'active' : ''} onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
                   &nbsp; Logout
                </a>
                {/* <a className={active === 'buy' ? 'active' : ''} onClick={() => handleClick('buy')}>Items</a> */}
                <a className={active === 'sell' ? 'active' : ''} onClick={() => handleClick('sell')}>Sell</a>
                <a className={active === 'mycart' ? 'active' : ''} onClick={() => handleClick('mycart')}>MyCart</a>
                <a className={active === 'ord' ? 'active' : ''} onClick={() => handleClick('ord')}>MyOrders</a>
                <a className={active === 'sold' ? 'active' : ''} onClick={() => handleClick('sold')}>SoldItems</a>
                <a className={active === 'search' ? 'active' : ''} onClick={() => handleClick('search')}>Search &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg> 

                </a>
                <div className='profile'>
                    <a style={{ 'color': "white", "fontWeight": "100", "fontSize": "18px" }} onClick={()=> handleClick('dashboard')}>{profile.firstname} &nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
</svg>
</a>
                </div>
            </div>
   
    <div className="product-details-container">
      <div className="product-card">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="product-image"
        />
        <div className="product-info">
          <h2>{product.productName}</h2>
          <p>
            <strong>Price:</strong> Rs {product.price} /-
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Seller:</strong> {product.seller}
          </p>
          <p>
            <strong>Contact:</strong> {product.sellerContact}
          </p>
          <p>
            <strong>Email:</strong> {product.sellerEmail}
          </p>
          <button className="add-to-cart-btn" onClick={addtocart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Items
