const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Place a bet
router.post('/:betId/place', authenticate, async (req, res) => {
  try {
    const { choice, amount } = req.body;

    const bet = await Bet.findById(req.params.betId);
    if (!bet) return res.status(404).json({ error: 'Bet not found' });

    if (new Date(bet.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Bet has expired' });
    }

    // Check if user already placed a bet on this option
    const alreadyPlaced = bet.participants.find(
      (p) => p.user.toString() === req.user.id && p.choice === choice
    );
    if (alreadyPlaced) return res.status(400).json({ error: 'Bet already placed on this option' });

    // Add participant
    bet.participants.push({ user: req.user.id, choice, amount });
    await bet.save();

    res.status(200).json({ message: 'Bet placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error placing bet' });
  }
});

module.exports = router;
