-- Create admins table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample admin user (password: "admin123")
-- Hash generated with bcrypt rounds=10
INSERT INTO admins (email, password_hash, role) VALUES 
('admin@example.com', '$2b$10$rQZ8kHWKtGY5uJQJ5vQJ5eKQJ5vQJ5eKQJ5vQJ5eKQJ5vQJ5eKQJ5e', 'admin');

-- Note: Replace the above hash with actual bcrypt hash of "admin123"
-- You can generate it using: bcrypt.hash('admin123', 10)