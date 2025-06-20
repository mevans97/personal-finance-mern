/**
 * Middleware: auth.js
 * -------------------
 * This middleware function protects private routes by verifying JSON Web Tokens (JWT).
 * It checks for the presence of a token in the 'Authorization' header,
 * verifies it using the server's secret key, and attaches the decoded user info to `req.user`.
 * If the token is missing or invalid, it blocks access and responds with an appropriate error.
 */

const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library used for verifying JWTs

// Middleware function to protect routes and authenticate users
function auth(req, res, next) {
  // Retrieve the token from the 'Authorization' header in the incoming request
  const token = req.header('Authorization');

  // If no token is found, return a 401 Unauthorized response
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Verify the token using the secret key stored in environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token payload (usually includes user ID) to the request object
    // This allows later middleware or route handlers to access `req.user`
    req.user = decoded;

    // Call the next middleware function in the stack
    next();
  } catch (err) {
    // If verification fails (e.g., token expired or tampered with), send 400 Bad Request
    res.status(400).json({ message: 'Invalid token' });
  }
}

// Export the middleware function so it can be used in route protection
module.exports = auth;