const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token string (e.g., "Bearer <token>" -> "<token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user from the token's ID and attach them to the request
      // We 'select(-password)' to make sure the hashed password isn't attached
      req.user = await User.findById(decoded.user.id).select('-password');

      next(); // Move to the next function (the actual controller)
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

// Optional: A guard for only producers
exports.isProducer = (req, res, next) => {
  if (req.user && req.user.userType === 'Producer') {
    next();
  } else {
    res.status(403).json({ msg: 'User is not a producer' });
  }
};


// Optional: A guard for only consumers
exports.isConsumer = (req, res, next) => {
  if (req.user && req.user.userType === 'Consumer') {
    next();
  } else {
    res.status(403).json({ msg: 'User is not a consumer' });
  }
};