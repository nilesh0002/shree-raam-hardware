import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  image: String
}, { timestamps: true });

let Product;

const mockProducts = [
  { _id: '1', name: 'Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg' },
  { _id: '2', name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg' },
  { _id: '3', name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg' },
  { _id: '4', name: 'Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg' },
  { _id: '5', name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg' },
  { _id: '6', name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg' }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
    console.log('DB error, using mock data:', error.message);
    return res.json(mockProducts);
  }
}