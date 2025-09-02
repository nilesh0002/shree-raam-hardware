import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  image: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Mock data
const mockProducts = [
  { _id: '1', name: 'Hammer', category: 'Tools', price: 250, stock: 50, image: 'hammer.jpg' },
  { _id: '2', name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30, image: 'screwdriver.jpg' },
  { _id: '3', name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15, image: 'drill.jpg' },
  { _id: '4', name: 'Paint Brush', category: 'Painting', price: 45, stock: 100, image: 'brush.jpg' },
  { _id: '5', name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25, image: 'cement.jpg' },
  { _id: '6', name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200, image: 'rod.jpg' }
];

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nilesh:nilesh%40123@cluster0.mongodb.net/hardware-store?retryWrites=true&w=majority');
  console.log('Connected to MongoDB');
} catch (error) {
  console.log('MongoDB connection failed, using mock data');
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Shree Raam Hardware API', status: 'running' });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.length > 0 ? products : mockProducts);
  } catch (error) {
    res.json(mockProducts);
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API working!', timestamp: new Date().toISOString() });
});

export default app;