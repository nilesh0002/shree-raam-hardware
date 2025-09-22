const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Extract merchant from subdomain
const extractMerchant = async (req, res, next) => {
  try {
    const host = req.get('host');
    const subdomain = host.split('.')[0];
    
    // Skip tenant resolution for super admin or localhost
    if (subdomain === 'admin' || host.includes('localhost')) {
      req.isSuperAdmin = true;
      return next();
    }

    // Find merchant by subdomain
    const result = await pool.query(
      'SELECT id, name, subdomain, is_active FROM merchants WHERE subdomain = $1',
      [subdomain]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const merchant = result.rows[0];
    
    if (!merchant.is_active) {
      return res.status(403).json({ error: 'Merchant account is inactive' });
    }

    req.merchant = merchant;
    req.merchantId = merchant.id;
    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add merchant filter to queries
const addMerchantFilter = (req, baseQuery, params = []) => {
  if (req.isSuperAdmin) {
    return { query: baseQuery, params };
  }
  
  const merchantFilter = baseQuery.includes('WHERE') 
    ? ` AND merchant_id = $${params.length + 1}`
    : ` WHERE merchant_id = $${params.length + 1}`;
    
  return {
    query: baseQuery + merchantFilter,
    params: [...params, req.merchantId]
  };
};

module.exports = { extractMerchant, addMerchantFilter };