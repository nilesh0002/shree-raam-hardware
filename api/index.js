const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://nilesh:nilesh%40123@cluster0.mongodb.net/hardware-store?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  image: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Initialize products
const initProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg' },
      { name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg' },
      { name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg' },
      { name: 'Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg' },
      { name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg' },
      { name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg' }
    ]);
  }
};

initProducts();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hardware Store API' });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;