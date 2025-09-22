const express = require('express');
const { Pool } = require('pg');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Valid order statuses
const VALID_STATUSES = ['pending', 'shipped', 'delivered'];

// GET /admin/orders - Get all orders with filters
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.created_at,
        o.updated_at,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    
    const queryParams = [];
    
    if (status && VALID_STATUSES.includes(status)) {
      query += ' WHERE o.status = $1';
      queryParams.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM orders o';
    let countParams = [];
    
    if (status && VALID_STATUSES.includes(status)) {
      countQuery += ' WHERE o.status = $1';
      countParams.push(status);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      orders: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /admin/orders/:id - Update order status
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate order ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: pending, shipped, or delivered' 
      });
    }

    // Check if order exists
    const checkResult = await pool.query('SELECT id FROM orders WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: result.rows[0] 
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;