const jwt = require('jsonwebtoken');

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!['admin', 'super_admin'].includes(decoded.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Attach admin info to request
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      merchantId: decoded.merchantId
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = { authenticateAdmin };