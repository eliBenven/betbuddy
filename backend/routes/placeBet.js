// routes/placeBet.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const Bet = require('../models/Bet');

const router = express.Router();

// Place a bet
router.post('/:betId', authenticate, async (req, res) => {
  try {
    const { choice } = req.body;
    const bet = await Bet.findById(req.params.betId);

    if (!bet) return res.status(404).json({ error: 'Bet not found' });

    if (new Date(bet.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Bet has expired' });
    }

    // Check if user already placed a bet
    const alreadyPlaced = bet.participants.find((p) => p.user.toString() === req.user.id);
    if (alreadyPlaced) return res.status(400).json({ error: 'Bet already placed' });

    bet.participants.push({ user: req.user.id, choice });
    await bet.save();

    res.status(200).json({ message: 'Bet placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error placing bet' });
  }
});

module.exports = router;
