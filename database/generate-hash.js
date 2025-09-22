const bcrypt = require('bcrypt');

// Generate hash for admin password
const generateHash = async () => {
  try {
    const password = 'admin123'; // Change this to your desired password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('Password:', password);
    console.log('Generated Hash:', hash);
    console.log('\nReplace REPLACE_WITH_GENERATED_HASH in your SQL files with the hash above');
    console.log('\nExample SQL:');
    console.log(`INSERT INTO admins (email, password_hash, role) VALUES ('admin@example.com', '${hash}', 'admin');`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
};

generateHash();