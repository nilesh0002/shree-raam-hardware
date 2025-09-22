-- Create merchants table
CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add merchant_id to existing tables
ALTER TABLE users ADD COLUMN merchant_id INTEGER REFERENCES merchants(id);
ALTER TABLE products ADD COLUMN merchant_id INTEGER REFERENCES merchants(id);
ALTER TABLE orders ADD COLUMN merchant_id INTEGER REFERENCES merchants(id);

-- Update admins table for super admin vs merchant admin
ALTER TABLE admins ADD COLUMN merchant_id INTEGER REFERENCES merchants(id);
ALTER TABLE admins ADD COLUMN role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin'));

-- Sample merchants
INSERT INTO merchants (name, subdomain, email) VALUES 
('Store One', 'store1', 'admin@store1.com'),
('Store Two', 'store2', 'admin@store2.com');

-- Create super admin (generate hash with: node database/generate-hash.js)
INSERT INTO admins (email, password_hash, role) VALUES 
('superadmin@platform.com', 'REPLACE_WITH_GENERATED_HASH', 'super_admin');

-- Create merchant admins (generate hash with: node database/generate-hash.js)
INSERT INTO admins (email, password_hash, role, merchant_id) VALUES 
('admin@store1.com', 'REPLACE_WITH_GENERATED_HASH', 'admin', 1),
('admin@store2.com', 'REPLACE_WITH_GENERATED_HASH', 'admin', 2);

-- Update existing data with merchant_id (assign to first merchant)
UPDATE users SET merchant_id = 1 WHERE merchant_id IS NULL;
UPDATE products SET merchant_id = 1 WHERE merchant_id IS NULL;
UPDATE orders SET merchant_id = 1 WHERE merchant_id IS NULL;