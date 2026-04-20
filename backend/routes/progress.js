const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('./auth'); // Extracting protect middleware

// GET current progress
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('completedModules highestUnlocked score');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      completedModules: user.completedModules,
      highestUnlocked: user.highestUnlocked,
      score: user.score
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// POST mark module as complete
router.post('/complete', protect, async (req, res) => {
  try {
    const { moduleId, scoreEarned } = req.body;
    
    if (!moduleId) {
      return res.status(400).json({ message: 'Module ID is required' });
    }

    const user = await User.findById(req.user._id);

    // Add module if not already completed
    if (!user.completedModules.includes(moduleId)) {
      user.completedModules.push(moduleId);
      
      // Update highest unlocked if necessary
      if (moduleId >= user.highestUnlocked) {
        user.highestUnlocked = moduleId + 1; 
      }
    }

    // Add score
    if (scoreEarned) {
      user.score += parseInt(scoreEarned, 10);
    }

    await user.save();
    
    res.json({
      completedModules: user.completedModules,
      highestUnlocked: user.highestUnlocked,
      score: user.score,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
});

// GET Leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ score: -1, completedModules: -1 })
      .limit(10)
      .select('name score');
    
    res.json({ leaderboard: topUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

module.exports = router;
