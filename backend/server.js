require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const merchantsRoutes = require('./routes/merchants');
const { authenticateAdmin } = require('./middleware/auth');
const { startStockMonitoring } = require('./utils/stockMonitor');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - whitelist your frontend domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/admin/products', productsRoutes);
app.use('/admin/orders', ordersRoutes);
app.use('/admin/users', usersRoutes);
app.use('/admin/dashboard', dashboardRoutes);
app.use('/admin/merchants', merchantsRoutes);

// Protected admin routes example
app.get('/admin/dashboard', authenticateAdmin, (req, res) => {
  res.json({ 
    message: 'Welcome to admin dashboard',
    admin: req.admin 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start stock monitoring cron job
  if (process.env.NODE_ENV !== 'test') {
    startStockMonitoring();
  }
});