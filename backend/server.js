const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment Variables with Fallbacks for easier sharing
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vivek_rakhsha';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only_12345';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected to Vivek Rakhsha DB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Vivek Rakhsha Backend is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
