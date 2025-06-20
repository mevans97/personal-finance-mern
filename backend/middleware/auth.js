const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization'); // read token from request
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now you can access req.user.id
    next(); // move to the next function
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

module.exports = auth;