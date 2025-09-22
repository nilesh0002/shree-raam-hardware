const cron = require('node-cron');
const { Pool } = require('pg');
const { sendLowStockAlert } = require('./emailService');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Check for low stock products and send daily alert
const checkLowStock = async () => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE stock < 5 AND stock > 0 ORDER BY stock ASC'
    );

    if (result.rows.length > 0) {
      await sendLowStockAlert(result.rows);
      console.log(`Daily low stock alert sent for ${result.rows.length} products`);
    }
  } catch (error) {
    console.error('Error checking low stock:', error);
  }
};

// Schedule daily low stock check at 9 AM
const startStockMonitoring = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', checkLowStock, {
    timezone: 'America/New_York' // Adjust timezone as needed
  });
  
  console.log('Stock monitoring cron job started - daily alerts at 9:00 AM');
};

module.exports = { startStockMonitoring, checkLowStock };