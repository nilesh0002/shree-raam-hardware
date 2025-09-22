const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const { uploadToR2, deleteFromR2 } = require('../utils/r2Upload');
const { authenticateAdmin } = require('../middleware/auth');
const { extractMerchant, addMerchantFilter } = require('../middleware/tenant');
const { sendOutOfStockAlert } = require('../utils/emailService');
const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractMerchant);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  },
});

// GET /admin/products/low-stock - Get low stock products
router.get('/low-stock', authenticateAdmin, async (req, res) => {
  try {
    const { query, params } = addMerchantFilter(req, 'SELECT * FROM products WHERE stock < 5 ORDER BY stock ASC, name ASC');
    const result = await pool.query(query, params);

    res.json({
      products: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

// GET /admin/products - Get all products
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { query: selectQuery, params: selectParams } = addMerchantFilter(
      req, 
      'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const result = await pool.query(selectQuery, selectParams);

    const { query: countQuery, params: countParams } = addMerchantFilter(req, 'SELECT COUNT(*) FROM products');
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      products: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /admin/products - Create new product
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Validate inputs
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    if (parseInt(stock) < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' });
    }

    // Create product first to get ID
    const merchantId = req.admin.role === 'super_admin' ? req.body.merchant_id : req.admin.merchantId;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, merchant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, parseFloat(price), parseInt(stock) || 0, category, merchantId]
    );

    const product = result.rows[0];
    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      imageUrl = await uploadToR2(req.file, product.id);
      
      // Update product with image URL
      await pool.query(
        'UPDATE products SET image_url = $1 WHERE id = $2',
        [imageUrl, product.id]
      );
      product.image_url = imageUrl;
    }

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /admin/products/:id - Update product
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    // Validate inputs
    if (price && parseFloat(price) <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    if (stock && parseInt(stock) < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' });
    }

    // Get current product
    const { query: selectQuery, params: selectParams } = addMerchantFilter(
      req, 
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    const currentResult = await pool.query(selectQuery, selectParams);
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentProduct = currentResult.rows[0];
    let imageUrl = currentProduct.image_url;

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (currentProduct.image_url) {
        await deleteFromR2(currentProduct.image_url);
      }
      
      // Upload new image
      imageUrl = await uploadToR2(req.file, id);
    }

    const newStock = stock !== undefined ? parseInt(stock) : currentProduct.stock;
    const oldStock = currentProduct.stock;

    // Update product
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [
        name || currentProduct.name,
        description !== undefined ? description : currentProduct.description,
        price ? parseFloat(price) : currentProduct.price,
        newStock,
        category || currentProduct.category,
        imageUrl,
        id
      ]
    );

    // Send email alert if stock went from > 0 to 0
    if (oldStock > 0 && newStock === 0) {
      await sendOutOfStockAlert(result.rows[0]);
    }

    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /admin/products/:id - Delete product
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get product to delete image
    const { query: selectQuery, params: selectParams } = addMerchantFilter(
      req,
      'SELECT image_url FROM products WHERE id = $1',
      [id]
    );
    const result = await pool.query(selectQuery, selectParams);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = result.rows[0];

    // Delete from database
    const { query: deleteQuery, params: deleteParams } = addMerchantFilter(
      req,
      'DELETE FROM products WHERE id = $1',
      [id]
    );
    await pool.query(deleteQuery, deleteParams);

    // Delete image from R2 if exists
    if (product.image_url) {
      await deleteFromR2(product.image_url);
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;