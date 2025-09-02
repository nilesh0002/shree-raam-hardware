# 🔨 Shree Raam Hardware - E-commerce Store

A modern, professional hardware store built with React and Node.js, featuring Apple Store-inspired design.

## ✨ Features

### 🛍️ Customer Features
- **Beautiful Product Catalog** - Apple Store-style design
- **Smart Shopping Cart** - Add, remove, update quantities
- **User Authentication** - Register and login system
- **Order Management** - Track and cancel orders
- **Address Book** - Save multiple delivery addresses
- **Mobile Responsive** - Perfect on all devices

### 👨💼 Admin Features
- **Dashboard Analytics** - Orders, revenue, inventory stats
- **Order Management** - Update order status, view details
- **Customer Management** - View all customer information
- **Inventory Tracking** - Real-time stock updates

### 🎨 Design
- **Apple Store Aesthetic** - Clean, minimal, professional
- **Mobile-First** - Optimized for phones and tablets
- **Smooth Animations** - Elegant hover effects
- **Professional Typography** - SF Pro Display font

## 🚀 Tech Stack

### Frontend
- **React** - Modern UI library
- **CSS3** - Apple Store-inspired styling
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - Database modeling

## 📱 Mobile Responsive
- ✅ iPhone/Android optimized
- ✅ Touch-friendly interface
- ✅ 2-column mobile grid
- ✅ Swipeable navigation

## 🛠️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/shree-raam-hardware.git
   cd shree-raam-hardware
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB connection string
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Environment Variables**
   Create `.env` in backend folder:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

## 🌐 Live Demo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=Tools` - Filter by category
- `GET /api/categories` - Get all categories

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/cancel` - Cancel order

### Users
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/:phone/orders` - Get user orders

### Admin
- `POST /api/admin/login` - Admin login (admin/shree@123)
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/stats` - Get dashboard stats

## 🎯 Usage

### For Customers
1. Browse products by category
2. Add items to cart
3. Register/Login to account
4. Place orders with delivery details
5. Track order status
6. Cancel orders if needed

### For Admin
1. Login with admin credentials
2. View dashboard analytics
3. Manage customer orders
4. Update order status
5. Monitor inventory

## 🔐 Admin Credentials
- **Username**: admin
- **Password**: shree@123

## 📱 Mobile Features
- Touch-optimized interface
- Swipe navigation
- Mobile-friendly forms
- Responsive product grid
- Full-screen mobile cart

## 🎨 Design Philosophy
Inspired by Apple Store's clean, minimal aesthetic:
- Clean typography
- Subtle shadows
- Professional color palette
- Smooth interactions
- Mobile-first approach

## 🚀 Deployment

Ready for deployment on:
- **Frontend**: Netlify, Vercel
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas

## 📄 License
MIT License - Feel free to use for your projects!

## 👨‍💻 Developer
Built with ❤️ for modern e-commerce needs

---

**Perfect for**: Hardware stores, retail businesses, e-commerce startups