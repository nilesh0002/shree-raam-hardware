const express = require('express');
const { Pool } = require('pg');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /admin/merchants - List all merchants (Super Admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    const result = await pool.query(`
      SELECT 
        m.*,
        COUNT(DISTINCT u.id) as user_count,
        COUNT(DISTINCT p.id) as product_count,
        COUNT(DISTINCT o.id) as order_count
      FROM merchants m
      LEFT JOIN users u ON m.id = u.merchant_id
      LEFT JOIN products p ON m.id = p.merchant_id  
      LEFT JOIN orders o ON m.id = o.merchant_id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `);

    res.json({ merchants: result.rows });
  } catch (error) {
    console.error('Get merchants error:', error);
    res.status(500).json({ error: 'Failed to fetch merchants' });
  }
});

// POST /admin/merchants - Create new merchant (Super Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    const { name, subdomain, email } = req.body;

    if (!name || !subdomain || !email) {
      return res.status(400).json({ error: 'Name, subdomain, and email are required' });
    }

    const result = await pool.query(
      'INSERT INTO merchants (name, subdomain, email) VALUES ($1, $2, $3) RETURNING *',
      [name, subdomain, email]
    );

    res.status(201).json({ success: true, merchant: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Subdomain already exists' });
    }
    console.error('Create merchant error:', error);
    res.status(500).json({ error: 'Failed to create merchant' });
  }
});

// PUT /admin/merchants/:id/toggle-active - Toggle merchant status
router.put('/:id/toggle-active', authenticateAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    const { id } = req.params;

    const result = await pool.query(
      'UPDATE merchants SET is_active = NOT is_active WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    res.json({ success: true, merchant: result.rows[0] });
  } catch (error) {
    console.error('Toggle merchant status error:', error);
    res.status(500).json({ error: 'Failed to update merchant status' });
  }
});

module.exports = router;