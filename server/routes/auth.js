const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  next();
};

module.exports = { authenticate, authorize };


// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// exports.authenticate = (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }
    
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// exports.authorize = (roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'User not authenticated' });
//     }
    
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Access denied' });
//     }
    
//     next();
//   };
// };
