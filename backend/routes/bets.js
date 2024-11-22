const express = require('express');
const { authenticate } = require('../middleware/auth');
const Item = require('../models/Item');
const Bet = require('../models/Bet');

const router = express.Router();

// Place a bet on an item
router.post('/:itemId/place', authenticate, async (req, res) => {
  try {
    const { choice, amount } = req.body;

    // Find the item (open bet)
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Check if the item has expired
    if (new Date(item.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'This item is no longer available for betting (expired)' });
    }

    // Create a new bet or update an existing one
    let bet = await Bet.findOne({ creator: item._id });
    if (!bet) {
      bet = new Bet({
        title: item.title,
        description: item.description,
        options: item.options,
        expiryDate: item.expiryDate,
        expiryTime: item.expiryTime,
        creator: item._id,
        totalWager: 0,
        image: item.image,
        participants: [],
      });
    }

    // Ensure the user has not already placed a bet on the same option
    const alreadyPlaced = bet.participants.find(
      (p) => p.user.toString() === req.user.id && p.choice === choice
    );
    if (alreadyPlaced) {
      return res.status(400).json({ error: 'You have already placed a bet on this option' });
    }

    // Add user to the bet's participants
    bet.participants.push({
      user: req.user.id,
      choice,
      amount,
    });

    // Update the total wager
    bet.totalWager += amount;

    // Save the bet
    await bet.save();

    res.status(200).json({ message: 'Bet placed successfully', bet });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ error: 'Internal server error while placing bet' });
  }
});

// Get all bets placed by the user
router.get('/', authenticate, async (req, res) => {
  try {
    const bets = await Bet.find({ 'participants.user': req.user.id });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bets' });
  }
});

module.exports = router;
