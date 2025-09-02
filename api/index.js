const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  image: String
}, { timestamps: true });

let Product;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Connect to MongoDB
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect('mongodb+srv://nilesh:nilesh%40123@cluster0.mongodb.net/hardware-store?retryWrites=true&w=majority');
    Product = mongoose.model('Product', productSchema);
  }
  
  if (req.url === '/api/products' && req.method === 'GET') {
    try {
      const products = await Product.find();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.json({ message: 'Hardware Store API' });
}