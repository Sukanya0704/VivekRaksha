const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Environment Variables with Fallbacks for easier sharing
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vivek_rakhsha';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only_12345';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    console.log(`🔗 Connected to: ${MONGODB_URI.replace(/\/\/.*@/, '//****@')}`); // Hide credentials if any
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error!');
    console.error('   Make sure MongoDB is running (Try: brew services start mongodb-community or equivalent)');
    console.error('   Error details:', err.message);
  });

// Routes
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const aiAnalyzerRoutes = require('./routes/aiAnalyzer');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/analyze', aiAnalyzerRoutes);

app.get('/', (req, res) => {
  res.send('Vivek Rakhsha Backend is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
