const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const xml2js = require("xml2js");
// import google.generativeai as genai
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyC0Iewr-Qq-EAk_smSZS9cZ4_Fwpv9CZvU');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key='+process.env.GEMINI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
// Initialize Express App
const app = express();
const cas_url = process.env.CAS_URL;
// Middleware
app.use(bodyParser.json());
app.use(cors());
// const JWT_SECRET = "your_jwt_secret_key";
// MongoDB Connection
const mongoURI = "mongodb+srv://arnav:123@shopspot.kvwgj.mongodb.net/?retryWrites=true&w=majority&appName=ShopSpot";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));



const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true, min: 18, max: 100 },
  contact: { type: String, required: true, match: /^[0-9]{10}$/ },
  password: { type: String, required: true },
});

// Product Schema
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Store image URL

  seller: { type: String, required: true },
  sellerContact: { type: String, required: true },
  sellerEmail: { type: String, required: true }
});

// cart schema
const cartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const ordersSchema = new mongoose.Schema({
  buyerEmail: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  seller: { type: String, required: true },
  buyer: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  otphashed: { type: String, required: true },
  productimageurl: { type: String, required: true },
  orderedon: { type: Date, required: true },
  updatedon: { type: Date, required: true },
});
const ChatSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  aiResponse: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userEmail: { type: String, required: true },
});

const Cart = mongoose.model('Cart', cartSchema);
// User Model
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("ProductDB", productSchema);
const Order = mongoose.model('Order', ordersSchema);
// module.exports = mongoose.model('Chat', ChatSchema);
const Chat = mongoose.model('Chat', ChatSchema);
// const Cart = mongoose.model("Cart", cartSchema);

const authenticateToken = (req, res, next) => {
  // Extract token from headers
  const token = req.headers.token;

  if (!token) {
    console.log("Token missing");
    return res.status(401).json({ message: "Access denied, token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // Store decoded user info in request
    next(); // Proceed to next middleware or route handler
  });
};

async function validate_cas(ticket) {
  try {
    console.log("CAs ticket", ticket);
    console.log("Hit validate_cas");
    const validateUrl = `${cas_url}/p3/serviceValidate?service=${encodeURIComponent('http://localhost:5000' + '/cas/callback')}&ticket=${ticket}`;
    console.log("validateUrl", validateUrl);
    const response = await axios.get(validateUrl);

    return new Promise((resolve, reject) => {
      xml2js.parseString(response.data, (err, result) => {
        if (err) reject(err);

        const serviceResponse = result['cas:serviceResponse'];
        if (serviceResponse['cas:authenticationSuccess']) {
          const success = serviceResponse['cas:authenticationSuccess'][0];
          const user = {
            email: success['cas:user'][0], // CAS returns email as user
            attributes: success['cas:attributes'] ? success['cas:attributes'][0] : {}
          };
          // find the user in the database with email
          // if user exists then return the user
          // const user= User.findOne({email:user.email});
          resolve(user);



        } else {
          reject(new Error('CAS Authentication failed'));
        }
      });
    });
  } catch (error) {
    throw new Error(`CAS Validation failed: ${error.message}`);
  }
}
// Signup Route
app.post("/", async (req, res) => {
  type = req.body.type;
  if (type == 2) {
    const { firstName, lastName, email, age, contact, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create and save the user
    const newUser = new User({
      firstName,
      lastName,
      email,
      age,
      contact,
      password: hashedPassword, // In production, hash this password using bcrypt or similar
    });

    try {
      await newUser.save();
      // const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
      res.name = firstName;
      res.email = email;
      res.status(201).json({
        message: "User registered successfully!",
        token, // Send the token in the response
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        age: newUser.age,
        contact: newUser.contact,
        password: newUser.password,
      });
    } catch (err) {
      console.error("Error saving user:", err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
  else {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if password is correct (hash comparison)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Send success response with token
    // res.name=user.firstName;
    // res.email=user.email;
    console.log(user.firstName);
    console.log(user.email);
    res.status(200).json({ message: "Login successful", token, name: user.firstName, email: user.email, lastName: user.lastName, age: user.age, contact: user.contact, password: user.password });
  }

});



// Dashboard Route (Update User)
app.post("/dashboard", authenticateToken, async (req, res) => {
  const { firstName, lastName, email, age, contact, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Update the user
  user.firstName = firstName;
  user.lastName = lastName;
  user.age = age;
  user.contact = contact;
  // user.password = hashedPassword;
  // compare the password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  try {
    await user.save();
    res.status(200).json({
      message: "User updated successfully!",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      contact: user.contact,
    });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Product Registration Route with Image Upload
app.post("/sell", authenticateToken, async (req, res) => {

  const productName = req.body.item;
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;
  // console.log(req.body);



  const imageUrl = req.body.imageurl;
  const user = req.body.seller;
  // convert email to string

  //  const userEmail=req.body.selleremail;
  const userEmail = (req.body.selleremail);
  const userContact = req.body.sellercontact;
  console.log("user", user);
  console.log("email", userEmail);
  console.log("contact", userContact);
  try {
    // Check if the user exists


    // Create and save the product
    const newProduct = new Product({
      productName: productName,
      price: price,
      description: description,
      category: category,
      imageUrl: imageUrl,
      seller: user,
      sellerContact: userContact,
      sellerEmail: userEmail
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product registered successfully!",
      product: {
        productName: newProduct.productName,
        price: newProduct.price,
        description: newProduct.description,
        category: newProduct.category,
        imageUrl: newProduct.imageUrl,
        seller: newProduct.user,
        sellerContact: newProduct.userContact,
        sellerEmail: newProduct.userEmail

      },
    });
    console.log("newProduct", newProduct);
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
// app.post('/products', async (req, res) => {
//   try {
//       const { categories } = req.body; // Expect an array of selected categories

//       // If no categories are provided, fetch all products
//       let query = {};
//       if (categories && categories.length > 0) {
//           query.category = { $in: categories }; // Match any category in the array
//       }

//       const products = await Product.find(query); // Fetch products from the database
//       console.log("products",products); 
//       res.status(200).json(products);
//   } catch (error) {
//       console.error('Error fetching products:', error);
//       res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });
app.post('/products', authenticateToken, async (req, res) => {
  try {
    const { categories, searchQuery } = req.body; // Expect an array of selected categories and a search query

    // Build the query object
    let query = {};

    // Filter by categories if provided
    if (categories && categories.length > 0) {
      query.category = { $in: categories }; // Match any category in the array
    }

    // Filter by search query if provided
    if (searchQuery) {
      query.productName = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search for product names
    }

    // Fetch products from the database based on the query
    const products = await Product.find(query);
    console.log("Filtered products:", products);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product'); // Assuming you have a Product model for your database

// Route to get product details by ID
app.get('/search/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId); // Fetch the product from your database
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("Product sent successfully:", product);
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/items', async (req, res) => {
  const { userEmail, product } = req.body;

  if (!userEmail || !product) {
    return res.status(400).json({ error: 'User email and product details are required' });
  }

  try {
    // Check if the cart exists for the user
    let userCart = await Cart.findOne({ userEmail });

    if (!userCart) {
      // Create a new cart for the user if it doesn't exist
      userCart = new Cart({
        userEmail,
        products: [product._id],
      });
    } else {
      // Check if the product is already in the cart
      if (!userCart.products.includes(product._id)) {
        // Add the product to the cart if it isn't already there
        userCart.products.push(product._id);
      }
    }

    // Save the cart to the database
    await userCart.save();
    return res.status(200).json({ message: 'Product added to cart successfully', cart: userCart });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/cart', authenticateToken, async (req, res) => {
  const { userEmail } = req.query; // Use query parameters for GET requests

  if (!userEmail) {
    return res.status(400).json({ error: 'User email is required' });
  }

  try {
    // Check if the cart exists for the user
    const userCart = await Cart.findOne({ userEmail });

    if (!userCart) {
      // Return an empty cart if none exists
      return res.status(200).json({ message: "he", products: [] });
    }

    // Fetch detailed information about the products in the cart
    const products = await Product.find({ _id: { $in: userCart.products } });
    const itemnames = [];
    products.forEach((item) => {
      itemnames.push(item.productName);
    });
    // console.log("itemnames",itemnames);
    return res.status(200).json({
      message: 'Cart fetched successfully',
      products,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/cart/remove', authenticateToken, async (req, res) => {
  const { userEmail, productId } = req.body;

  if (!userEmail || !productId) {
    return res.status(400).json({ error: 'User email and product ID are required' });
  }

  try {
    // Find the user's cart
    const userCart = await Cart.findOne({ userEmail });

    if (!userCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove the item from the cart
    userCart.products = userCart.products.filter(id => id.toString() !== productId);

    // Save the updated cart
    await userCart.save();

    // Fetch updated products to send back to the frontend
    const updatedProducts = await Product.find({ _id: { $in: userCart.products } });

    return res.status(200).json({
      message: 'Product removed from cart',
      products: updatedProducts,
    });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/placeorder', authenticateToken, async (req, res) => {
  const { buyerEmail, cartItems } = req.body;
  for (const item of cartItems) {
    console.log(item.productName);
  }
  if (!buyerEmail || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const orders = [];

    for (const item of cartItems) {
      // Ensure buyer is not the seller
      if (item.sellerEmail === buyerEmail) {
        continue;
      }

      // Generate random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);
      const product = await Product.findById(item._id);
      const url = product.imageUrl;
      const Buyer = await User.findOne({ email: buyerEmail });
      bname = Buyer.firstName;
      // Create order
      orders.push({
        buyerEmail,

        sellerEmail: item.sellerEmail,
        productId: item._id,
        productName: item.productName,
        price: item.price,
        status: 'Pending',
        otphashed: otp,
        seller: item.seller,
        buyer: bname,
        productimageurl: url,
        orderedon: new Date(),
        updatedon: new Date(),
      });
      const to_be_added = {
        buyerEmail,
        sellerEmail: item.sellerEmail,
        productId: item._id,
        productName: item.productName,
        price: item.price,
        seller: item.seller,
        buyer: bname,
        productimageurl: url,
        status: 'Pending',
        otphashed: otpHash,
        orderedon: new Date(),
        updatedon: new Date(),
      };

      console.log("to_be_added", to_be_added);
      await Order.create(to_be_added);


      // Notify the buyer (send OTP via email in production)
      console.log(`OTP for order ${item.productName}: ${otp}`);
    }

    // Insert orders into the database
    // await Order.insertMany(orders);

    // Clear buyer's cart
    await Cart.deleteMany({ userEmail: buyerEmail });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error placing orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/orders', authenticateToken, async (req, res) => {
  const { email, role } = req.query;
  // const role =req.body.role;

  console.log("role", role);

  if (!email || !role) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    if (role === 'buyer') {
      // Orders placed by the user
      const orders = await Order.find({ buyerEmail: email });
      return res.status(200).json({ orders });
    } else if (role === 'seller') {
      // Orders received by the user
      const orders = await Order.find({ sellerEmail: email });

      return res.status(200).json({ orders });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/delorders', authenticateToken, async (req, res) => {
  const { email, role } = req.query;
  // const role =req.body.role;

  console.log("role", role);

  if (!email || !role) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    if (role === 'buyer') {
      // Orders placed by the user
      const orders = await Order.find({ buyerEmail: email });
      return res.status(200).json({ orders });
    } else if (role === 'seller') {
      // Orders received by the user
      var orders = await Order.find({ sellerEmail: email });
      // remove orders with status delivered
      orders = orders.filter(order => order.status !== 'Delivered');
      return res.status(200).json({ orders });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// app.get('delieverfetch', async (req, res) => {
//   const { email, role } = req.query;
//   // const role =req.body.role;


//   console.log("role",role);

//   if (!email || !role) {
//     return res.status(400).json({ error: 'Invalid request' });
//   }

//   try {
//     if (role === 'buyer') {
//       // Orders placed by the user
//       const orders = await Order.find({ buyerEmail: email });
//       return res.status(200).json({ orders });
//     } else if (role === 'seller') {
//       // Orders received by the user
//       const orders = await Order.find({ sellerEmail: email });

//       return res.status(200).json({ orders });
//     } else {
//       return res.status(400).json({ error: 'Invalid role' });
//     }
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });
app.post('/deliver', authenticateToken, async (req, res) => {
  const { orderId, otp } = req.body;

  if (!orderId || !otp) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  console.log("recieved", otp);
  try {
    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    console.log("hash", order.otphashed);
    // Validate OTP
    const isOtpValid = await bcrypt.compare(otp, order.otphashed);

    if (!isOtpValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark order as delivered
    order.status = 'Delivered';
    order.updatedAt = new Date();
    await order.save();

    return res.status(200).json({ message: 'Order delivered successfully' });
  } catch (error) {
    console.error('Error delivering order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/chathistory', authenticateToken, async (req, res) => {
  const userEmail = req.query.email;
  console.log("userEmail", userEmail);
  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    const chatHistory = await Chat.find({ userEmail }).sort({ timestamp: 1 }); // Sort by timestamp
    console.log("chatHistory", chatHistory);
    res.status(200).json({ chatHistory });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    console.log("error", error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});


app.post('/chat', authenticateToken, async (req, res) => {
  console.log("req.body", req.body);
  const userMessage = req.body.UserMessage;
  const userEmail = req.body.userEmail
  const fullquery = req.body.FullQuery;
  console.log("userMessage", userMessage);
  if (!userMessage || !userEmail) {
    return res.status(400).json({ message: 'User message and email are required' });
  }

  try {
    // Simulate AI response (replace with actual AI integration logic)
    const prompt = fullquery;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    const aiResponse = result.response.text();

    // Create a new chat document
    const chat = new Chat({
      userMessage,
      aiResponse,
      userEmail,
    });

    await chat.save(); // Save chat to the database
    res.status(201).json({ message: 'Message sent successfully', chat });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

app.get("/cas/login", (req, res) => {
  console.log("Redirecting to CAS login reached in backend");
  const loginUrl = `${cas_url}/login?service=${encodeURIComponent(
    process.env.SERVICE_URL + "/cas/callback"
  )}`;
  // loginUrl = "${casConfig.cas_url}/login";
  console.log("Login URL:", loginUrl);
  // res.json({})
  res.status(200).json({ loginUrl: loginUrl });
});



// CAS Callback route
app.get("/cas/callback", async (req, res) => {
  try {
    const { ticket } = req.query;
    if (!ticket) {
      return res.redirect('/?error=no_ticket');
    }
    console.log(" Ahhhhticket", ticket);
    // Validate the CAS ticket
    const userData = await validate_cas(ticket);
    console.log("userData", userData);
    /// if the user is validated then redirect it to the login page and send the token
    if (userData) {
      console.log("user is validated");
      // find the user in the database with email
      const user = await User.findOne({ email: userData.email });
      console.log("user", user);
      if (user) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "30h" });
        // res.name=user.firstName;
        // res.email=user.email;
        // res.status(201).json({
        //   message: "User registered successfully!",
        //   token, // Send the token in the response
        //   firstName: user.firstName,
        //   lastName: user.lastName,
        //   email: user.email,
        //   age: user.age,
        //   contact: user.contact,
        //   password: user.password,
        // });
        console.log("dashboard jaa rahe");
        res.redirect('http://localhost:5173/middash?token=' + token);


      }
      // else{
      //   res.redirect('http://localhost:5173/login');
      // }

    }
    else {
      console.log("user is not validated");
      res.redirect('http://localhost:5173/signup');
    }
  } catch (error) {
    console.error('CAS authentication error:', error);
    res.redirect('/login?error=cas_auth_failed');
  }
});
app.get("/verify", async (req, res) => {
  try {
    // Get token from query params
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    console.log("Received token:", token);

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId; // Extract user ID from token

    console.log("Decoded userId:", userId);

    // Find user in the database
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    // Respond with user details
    res.status(200).json({
      message: "User verified successfully!",
      token, // Sending the same token back
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      contact: user.contact,
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
// module.exports = router; 
app.post('/changepassword', authenticateToken, async (req, res) => {
  const email = req.body.email;
  const oldpassword = req.body.oldpassword;
  const newpassword = req.body.newpassword;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(oldpassword, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const hashedPassword = await bcrypt.hash(newpassword, 10);
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ message: 'Password changed successfully' });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
