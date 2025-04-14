// middleware/roles.js
const { ROLES, PERMISSIONS, PERMISSION_LEVELS } = require('../config/constants');

/**
 * Middleware to check if user has required role
 * @param {Array} allowedRoles - Array of roles allowed to access the resource
 * @returns {Function} Express middleware
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Allow guests when specifically included in allowed roles
    if (!req.user && allowedRoles.includes(ROLES.GUEST)) {
      req.user = { role: ROLES.GUEST };
      return next();
    }

    // Require authentication for non-guest routes
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Ensure user has a role (default to student if none)
    const userRole = req.user.role || ROLES.STUDENT;
    
    // Check if user's role is allowed
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  };
};

/**
 * Middleware to check if user has permission for an operation
 * @param {string} operation - Operation name from PERMISSIONS
 * @returns {Function} Express middleware
 */
const hasPermission = (operation) => {
  return (req, res, next) => {
    if (!PERMISSIONS[operation]) {
      console.warn(`Operation "${operation}" not defined in permissions`);
      return next();
    }

    // Allow guests when operation permits
    if (!req.user && PERMISSIONS[operation].includes(ROLES.GUEST)) {
      req.user = { role: ROLES.GUEST };
      return next();
    }

    // Require authentication for non-guest operations
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check permission
    const userRole = req.user.role || ROLES.STUDENT;
    if (PERMISSIONS[operation].includes(userRole)) {
      return next();
    }

    return res.status(403).json({ error: 'Insufficient permissions' });
  };
};

/**
 * Checks if the user has admin access to modify another user
 * Prevents users from modifying users with higher permissions
 */
const adminAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Only admins can modify users
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

module.exports = {
  checkRole,
  hasPermission,
  adminAccess
};
