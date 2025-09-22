const express = require('express');
const { Pool } = require('pg');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /admin/dashboard-stats - Get dashboard statistics
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Get total sales (sum of delivered orders)
    const salesResult = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total_sales FROM orders WHERE status = 'delivered'"
    );

    // Get pending orders count
    const pendingResult = await pool.query(
      "SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'"
    );

    // Get low stock products count
    const lowStockResult = await pool.query(
      "SELECT COUNT(*) as low_stock_products FROM products WHERE stock < 5"
    );

    // Get total users count
    const usersResult = await pool.query(
      "SELECT COUNT(*) as total_users FROM users"
    );

    const stats = {
      totalSales: parseFloat(salesResult.rows[0].total_sales),
      pendingOrders: parseInt(pendingResult.rows[0].pending_orders),
      lowStockProducts: parseInt(lowStockResult.rows[0].low_stock_products),
      totalUsers: parseInt(usersResult.rows[0].total_users)
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;