const express = require('express');
const { authenticate } = require('../middleware/auth');
const Group = require('../models/Group');

const router = express.Router();

// Get all groups (for debugging or listing)
router.get('/', authenticate, async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Error fetching groups' });
  }
});

// Get user-specific groups
router.get('/user', authenticate, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'username email');
    res.json(groups);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Error fetching user groups' });
  }
});

module.exports = router;
