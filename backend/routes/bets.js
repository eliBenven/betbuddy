const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Item = require('../models/Item');
const Bet = require('../models/Bet');

const router = express.Router();

// routes/items/routes.js: Updated place bet route
router.post('/:itemId/place', authenticate, async (req, res) => {
  try {
    const { choice, amount } = req.body;

    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (new Date(item.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Bet on this item has expired' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct bet amount from user's balance
    user.balance -= amount;

    // Add the bet to user's bet history
    user.betHistory.push({
      item: item._id,
      amount,
      choice,
      result: 'pending',
    });

    await user.save();

    const bet = new Bet({
      title: item.title,
      description: item.description,
      choice,
      expiryDate: item.expiryDate,
      expiryTime: item.expiryTime,
      creator: item.creator._id,
      participants: [
        {
          user: req.user.id,
          choice,
          amount,
        },
      ],
      totalWager: amount,
      image: item.image,
    });

    await bet.save();

    res.status(200).json({ message: 'Bet placed successfully', userBalance: user.balance });
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

// routes/bets.js
router.put('/:betId/result', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { winner } = req.body;

    // Find the bet by ID
    const bet = await Bet.findById(req.params.betId);
    if (!bet) return res.status(404).json({ error: 'Bet not found' });

    // Update the bet status and result
    bet.status = 'settled';
    bet.result = { winner, timestamp: new Date() };

    // Process participants
    for (const participant of bet.participants) {
      const user = await User.findById(participant.user);
      if (!user) continue; // Skip if user not found

      // Update user's bet history
      const userBet = user.betHistory.find(
        (b) => b.item.toString() === bet._id.toString()
      );

      if (!userBet) continue;

      if (participant.choice === winner) {
        userBet.result = 'won';

        // Calculate winnings
        const winnings = participant.amount * 2; // For simplicity, 1:1 payout
        user.balance += winnings;
      } else {
        userBet.result = 'lost';
        // User already lost the amount when placing the bet
      }

      await user.save();
    }

    await bet.save(); // Save the updated bet
    res.status(200).json({ message: 'Bet result updated successfully', bet });
  } catch (error) {
    console.error('Error updating bet result:', error.message);
    res.status(500).json({ error: 'Error updating bet result' });
  }
});


module.exports = router;
