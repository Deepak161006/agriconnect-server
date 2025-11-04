const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login a user (returns a JWT token)
router.post('/login', loginUser);
router.put('/updateme', protect, updateUserProfile);

module.exports = router;