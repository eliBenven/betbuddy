// routes/betHistory.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const Bet = require('../models/Bet');

const router = express.Router();

// Get bet history
router.get('/', authenticate, async (req, res) => {
  try {
    const bets = await Bet.find({ 'participants.user': req.user.id });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bet history' });
  }
});

module.exports = router;
