# 🛒 Buy-Sell-Rent Website (ShopSpot)

A comprehensive e-commerce platform built with React and Node.js that allows users to buy, sell, and rent items within the IIIT Hyderabad community. The platform features user authentication, product management, shopping cart functionality, order tracking, and AI-powered support.

## 🌟 Features

### 🔐 Authentication & User Management

- **User Registration & Login**: Secure user authentication with JWT tokens
- **IIIT Email Validation**: Restricted to `@students.iiit.ac.in` and `@research.iiit.ac.in` domains
- **Profile Management**: Users can view and edit their profile information
- **Password Management**: Secure password change functionality with bcrypt hashing
- **Session Management**: Persistent login sessions with localStorage

### 🛍️ Product Management

- **Product Listing**: Browse available items for purchase
- **Product Categories**: Organized product catalog with category filtering
- **Product Details**: Comprehensive product information including images, descriptions, and pricing
- **Seller Information**: Contact details and seller profiles for each product

### 📦 Shopping Experience

- **Shopping Cart**: Add/remove items with persistent cart storage
- **Search Functionality**: Advanced search with filters and sorting options
- **Product Images**: Visual product representation with image upload support
- **Price Management**: Transparent pricing with seller-defined costs

### 💰 Selling & Renting

- **Sell Items**: Easy product listing with image upload and detailed descriptions
- **Rent Items**: Offer items for rental with flexible pricing
- **Inventory Management**: Track your listed items and their status
- **Order Management**: Handle incoming orders and buyer communications

### 📋 Order Management

- **Order Tracking**: Monitor order status from placement to delivery
- **Order History**: Complete order history for both buyers and sellers
- **Status Updates**: Real-time order status updates
- **Delivery Management**: Track items sold and delivered

### 🤖 AI-Powered Support

- **Chatbot Integration**: Google Gemini AI-powered support system
- **Query Resolution**: Automated responses to common questions
- **User Assistance**: Help with platform navigation and troubleshooting

### 🎨 User Interface

- **Responsive Design**: Mobile-friendly interface with Bootstrap and Tailwind CSS
- **Modern UI**: Clean and intuitive user experience
- **Navigation**: Easy-to-use navigation with protected routes
- **Dashboard**: Centralized user dashboard with quick access to all features

## 🛠️ Technology Stack

### Frontend

- **React 18.3.1**: Modern React with hooks and functional components
- **React Router DOM 7.1.3**: Client-side routing and navigation
- **React Hook Form 7.54.2**: Form handling and validation
- **Bootstrap 5.3.3**: UI framework for responsive design
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Axios 1.7.9**: HTTP client for API communication
- **Vite 6.0.7**: Fast build tool and development server

### Backend

- **Node.js**: JavaScript runtime environment
- **Express.js 4.21.2**: Web application framework
- **MongoDB 6.12.0**: NoSQL database with Mongoose ODM
- **JWT 9.0.2**: JSON Web Tokens for authentication
- **bcryptjs 2.4.3**: Password hashing and security
- **Multer 1.4.5**: File upload handling
- **CORS 2.8.5**: Cross-origin resource sharing
- **Google Generative AI 0.21.0**: AI-powered chatbot integration

### Database Schema

- **Users**: User profiles with authentication data
- **Products**: Product listings with seller information
- **Cart**: Shopping cart items for each user
- **Orders**: Order tracking and management
- **Chat**: AI conversation history

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB installation)
- Google Generative AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Buy-Sell-Rent-Website
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**

   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the backend directory:

   ```env
   JWT_SECRET=your_jwt_secret_key_here
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopspot
   GEMINI_API_KEY=your_google_generative_ai_api_key
   CAS_URL=your_cas_url_if_using_cas_authentication
   ```

5. **Database Configuration**

   Update the MongoDB connection string in `backend/index.js`:

   ```javascript
   const mongoURI = "your_mongodb_connection_string";
   ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   The backend will start on `http://localhost:5000`

2. **Start the Frontend Development Server**

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

3. **Access the Application**

   Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Buy-Sell-Rent-Website/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── App.jsx      # Main application component
│   │   │   ├── Dashboard.jsx # User dashboard
│   │   │   ├── Login.jsx    # Authentication
│   │   │   ├── Items.jsx    # Product listings
│   │   │   ├── MyCart.jsx   # Shopping cart
│   │   │   ├── Orders.jsx   # Order management
│   │   │   ├── Sell.jsx     # Product selling
│   │   │   ├── Search.jsx   # Search functionality
│   │   │   └── Support.jsx  # AI support system
│   │   ├── styles/          # CSS files
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── backend/                  # Node.js backend application
│   ├── index.js             # Main server file
│   ├── package.json         # Backend dependencies
│   └── models/              # Database schemas
└── README.md                # Project documentation
```

## 🔧 Available Scripts

### Frontend Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Backend Scripts

- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user passwords
- **Protected Routes**: Route protection for authenticated users
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🎯 Key Features in Detail

### User Authentication Flow

1. User registers with IIIT email domain
2. Email validation and password hashing
3. JWT token generation and storage
4. Protected route access based on authentication status

### Product Management

1. Sellers can list products with images and descriptions
2. Buyers can browse, search, and filter products
3. Shopping cart functionality with persistent storage
4. Order placement with OTP verification

### Order Processing

1. Order creation with buyer/seller information
2. Status tracking (pending, confirmed, delivered)
3. Order history for both parties
4. Delivery confirmation system

### AI Support System

1. Google Gemini AI integration
2. Context-aware responses
3. Conversation history storage
4. User query resolution

