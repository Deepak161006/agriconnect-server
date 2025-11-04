const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER USER ---
exports.registerUser = async (req, res) => {
  const { fullName, email, password, userType } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user (in memory)
    user = new User({ fullName, email, password, userType });

    // 3. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save to database
    await user.save();

    // Don't send the token on register, just a success message
    res.status(201).json({ msg: 'User registered successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- LOGIN USER ---
exports.loginUser = async (req, res) => {
  console.log('Login attempt started...'); // <-- DEBUG
  const { email, password } = req.body;
  console.log('Attempting login for email:', email); // <-- DEBUG

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('DEBUG: User not found with that email.'); // <-- DEBUG
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    console.log('DEBUG: User found:', user.email); // <-- DEBUG

    // 2. Compare the text password to the hashed password
    console.log('DEBUG: Comparing passwords...'); // <-- DEBUG
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('DEBUG: Password comparison FAILED.'); // <-- DEBUG
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('DEBUG: Password comparison SUCCEEDED.'); // <-- DEBUG

    // 3. Create a JWT token
    const payload = {
      user: {
        id: user.id,
        type: user.userType
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userType: user.userType,
      name: user.fullName
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ... (keep your registerUser and loginUser functions)

// --- ADD THIS NEW FUNCTION ---
// @desc    Update a user's location or phone
// @route   PUT /api/auth/updateme
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const { location, tel } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields if they were provided
    if (location) user.location = location;
    if (tel) user.tel = tel;

    await user.save();
    res.json({ msg: 'Profile updated', user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};