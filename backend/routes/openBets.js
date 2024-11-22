// routes/openBets.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const Bet = require('../models/Bet');

const router = express.Router();

// Get all open bets
router.get('/', authenticate, async (req, res) => {
  try {
    const bets = await Bet.find({ expiryDate: { $gte: new Date() } });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching open bets' });
  }
});

module.exports = router;
