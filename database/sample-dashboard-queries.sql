-- Sample SQL queries for dashboard statistics

-- 1. Total Sales (sum of delivered orders)
SELECT COALESCE(SUM(total_amount), 0) as total_sales 
FROM orders 
WHERE status = 'delivered';

-- 2. Pending Orders Count
SELECT COUNT(*) as pending_orders 
FROM orders 
WHERE status = 'pending';

-- 3. Low Stock Products Count
SELECT COUNT(*) as low_stock_products 
FROM products 
WHERE stock < 5;

-- 4. Total Users Count
SELECT COUNT(*) as total_users 
FROM users;

-- Combined query for all stats (more efficient)
SELECT 
  (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'delivered') as total_sales,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
  (SELECT COUNT(*) FROM products WHERE stock < 5) as low_stock_products,
  (SELECT COUNT(*) FROM users) as total_users;