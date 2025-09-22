const express = require('express');
const { Pool } = require('pg');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /admin/users - Get all users with pagination
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT id, name, email, is_active, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /admin/users/:id/toggle-active - Toggle user active status
router.put('/:id/toggle-active', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if user exists
    const checkResult = await pool.query('SELECT id, is_active FROM users WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentStatus = checkResult.rows[0].is_active;
    const newStatus = !currentStatus;

    // Toggle active status
    const result = await pool.query(
      'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, name, email, is_active',
      [newStatus, id]
    );

    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'blocked'} successfully`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// GET /admin/users/:id/orders - Get user's order history
router.get('/:id/orders', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if user exists
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's orders
    const ordersResult = await pool.query(
      'SELECT id, total_amount, status, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({
      user: userResult.rows[0],
      orders: ordersResult.rows
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

module.exports = router;