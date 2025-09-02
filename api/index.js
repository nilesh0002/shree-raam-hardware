export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const products = [
    { _id: '1', name: 'Hammer', category: 'Tools', price: 250, stock: 50 },
    { _id: '2', name: 'Screwdriver Set', category: 'Tools', price: 180, stock: 30 },
    { _id: '3', name: 'Drill Machine', category: 'Power Tools', price: 2500, stock: 15 },
    { _id: '4', name: 'Paint Brush', category: 'Painting', price: 45, stock: 100 },
    { _id: '5', name: 'Cement (50kg)', category: 'Construction', price: 350, stock: 25 },
    { _id: '6', name: 'Steel Rod (12mm)', category: 'Construction', price: 65, stock: 200 }
  ];
  
  if (req.url === '/api/products') {
    return res.json(products);
  }
  
  if (req.url === '/api/test') {
    return res.json({ message: 'API working!', timestamp: new Date().toISOString() });
  }
  
  return res.json({ message: 'Shree Raam Hardware API' });
}