// routes/bets.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const Bet = require('../models/Bet');

const router = express.Router();

// Create a new bet
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, options, expiryDate, expiryTime, totalWager, image } = req.body;

    const newBet = new Bet({
      title,
      description,
      options,
      expiryDate,
      expiryTime,
      totalWager,
      creator: req.user.id,
      image,
    });

    const savedBet = await newBet.save();
    res.status(201).json(savedBet);
  } catch (error) {
    res.status(500).json({ error: 'Error creating bet' });
  }
});

module.exports = router;
