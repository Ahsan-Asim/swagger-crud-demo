// Import secret from config (instead of hardcoding it)
const config = require('../config');

// Middleware to check if the user is authorized
const authorize = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);  // Use secret from config
    req.user = decoded;  // Add the decoded user info to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authorize;
