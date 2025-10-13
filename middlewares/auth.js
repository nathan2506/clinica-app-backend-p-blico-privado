const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(req, res, next) {
  // Accept token in Authorization header or httpOnly cookie named 'token'
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
  else if (req.cookies && req.cookies.token) token = req.cookies.token;

  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const role = req.user.role || 'user';
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  }
}

module.exports = { authenticate, authorize };
