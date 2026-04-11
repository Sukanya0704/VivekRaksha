const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, pin } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ phone });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, phone, pin });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;
    
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePin(pin);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
