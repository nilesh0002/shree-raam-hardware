const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  image: String
}, { timestamps: true });

let Product;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect('mongodb+srv://nilesh:nilesh%40123@cluster0.mongodb.net/hardware-store?retryWrites=true&w=majority');
      Product = mongoose.model('Product', productSchema);
    }
    
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}