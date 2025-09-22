const bcrypt = require('bcrypt');

// Generate hash for password "admin123"
const generateHash = async () => {
  try {
    const password = 'admin123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nUse this hash in your SQL INSERT statement:');
    console.log(`INSERT INTO admins (email, password_hash, role) VALUES ('admin@example.com', '${hash}', 'admin');`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
};

generateHash();