const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data - Hardware Store Products
const products = [
  { _id: '1', name: 'Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg' },
  { _id: '2', name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg' },
  { _id: '3', name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg' },
  { _id: '4', name: 'Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg' },
  { _id: '5', name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg' },
  { _id: '6', name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg' }
];

const categories = ['Tools', 'Power Tools', 'Painting', 'Construction'];

// Routes
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

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = products.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  res.json(filteredProducts);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Admin login (simple)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'shree@123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
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