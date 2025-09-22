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
-- Generate hash using: node database/generate-hash.js
INSERT INTO admins (email, password_hash, role) VALUES 
('admin@example.com', 'REPLACE_WITH_GENERATED_HASH', 'admin');

-- Note: Replace REPLACE_WITH_GENERATED_HASH with actual bcrypt hash
-- Run: node database/generate-hash.js to generate the hash