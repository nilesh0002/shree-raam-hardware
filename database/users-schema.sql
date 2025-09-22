-- Update users table to include is_active column
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- If users table doesn't exist, create it
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing sample data and insert new data with is_active
DELETE FROM users;
INSERT INTO users (name, email, is_active) VALUES 
('John Doe', 'john@example.com', true),
('Jane Smith', 'jane@example.com', true),
('Bob Johnson', 'bob@example.com', false),
('Alice Brown', 'alice@example.com', true),
('Charlie Wilson', 'charlie@example.com', true),
('Diana Davis', 'diana@example.com', false);