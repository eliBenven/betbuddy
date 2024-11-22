// routes/friends.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all friends
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username email');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friends' });
  }
});

// Add a new friend
router.post('/', authenticate, async (req, res) => {
  try {
    const { email } = req.body;
    const friend = await User.findOne({ email });

    if (!friend) return res.status(404).json({ error: 'Friend not found' });

    const user = await User.findById(req.user.id);

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ error: 'Friend already added' });
    }

    user.friends.push(friend._id);
    await user.save();

    res.status(201).json(friend);
  } catch (error) {
    res.status(500).json({ error: 'Error adding friend' });
  }
});

module.exports = router;
