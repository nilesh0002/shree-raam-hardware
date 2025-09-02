const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize products if database is empty
const initializeProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        { name: 'Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg' },
        { name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg' },
        { name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg' },
        { name: 'Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg' },
        { name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg' },
        { name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg' }
      ];
      await Product.insertMany(products);
      console.log('Products initialized');
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};

// MongoDB Connection with better configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    console.log('Connected to MongoDB Atlas');
    await initializeProducts();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Return mock data if DB fails
    return false;
  }
};

connectDB();

// Mock data fallback
const mockProducts = [
  { _id: '1', name: 'Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg' },
  { _id: '2', name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg' },
  { _id: '3', name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg' },
  { _id: '4', name: 'Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg' },
  { _id: '5', name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg' },
  { _id: '6', name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg' }
];

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    
    // Try database first
    if (mongoose.connection.readyState === 1) {
      const filter = category ? { category: new RegExp(category, 'i') } : {};
      const products = await Product.find(filter).maxTimeMS(5000);
      res.json(products);
    } else {
      // Fallback to mock data
      let products = mockProducts;
      if (category) {
        products = mockProducts.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      res.json(products);
    }
  } catch (error) {
    // Return mock data on error
    let products = mockProducts;
    if (req.query.category) {
      products = mockProducts.filter(p => p.category.toLowerCase().includes(req.query.category.toLowerCase()));
    }
    res.json(products);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, address, items, total } = req.body;
    const order = new Order({ customerName, phone, address, items, total });
    await order.save();
    
    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Product.distinct('category').maxTimeMS(5000);
      res.json(categories);
    } else {
      // Fallback categories
      res.json(['Tools', 'Power Tools', 'Painting', 'Construction']);
    }
  } catch (error) {
    // Return mock categories on error
    res.json(['Tools', 'Power Tools', 'Painting', 'Construction']);
  }
});

// User Authentication Routes
app.post('/api/user/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone or email' });
    }
    
    const user = new User({ name, phone, email, password });
    await user.save();
    
    res.status(201).json({ success: true, message: 'Account created successfully', user: { name, phone, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const user = await User.findOne({ phone });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }
    
    res.json({ success: true, user: { name: user.name, phone: user.phone, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Account Routes
app.get('/api/user/:phone', async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:phone/orders', async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user/:phone/address', async (req, res) => {
  try {
    const { addresses } = req.body;
    const user = await User.findOneAndUpdate(
      { phone: req.params.phone },
      { addresses },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );
    
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.id, { $inc: { stock: item.quantity } });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shree Raam Hardware Store API', 
    status: 'Server is running!',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      test: '/api/test'
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Admin credentials from environment variables
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shree@123';
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Admin Routes
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const totalProducts = await Product.countDocuments();
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Shree Raam Hardware API running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;