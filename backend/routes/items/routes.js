const express = require('express');
const { authenticate } = require('../../middleware/auth');
const Item = require('../../models/Item');
const Bet = require('../../models/Bet');
const { authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

// Place a bet on an item
router.post('/:itemId/place', authenticate, async (req, res) => {
  try {
    const { choice, amount } = req.body;

    // Find the item the user is betting on
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Check if the item has expired
    if (new Date(item.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Bet on this item has expired' });
    }

    // Find or create a Bet record for the Item
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

    // Check if the user has already placed a bet on this choice
    const alreadyPlaced = bet.participants.find(
      (p) => p.user.toString() === req.user.id && p.choice === choice
    );
    if (alreadyPlaced) {
      return res.status(400).json({ error: 'You have already placed a bet on this choice' });
    }

    // Add the user's bet to the participants
    bet.participants.push({
      user: req.user.id,
      choice,
      amount,
    });

    // Update total wager
    bet.totalWager += amount;

    // Save the Bet
    await bet.save();

    res.status(200).json({ message: 'Bet placed successfully', bet });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ error: 'Internal server error while placing bet' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID format or internal error' });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format or internal error' });
  }
});

// Delete Item
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

module.exports = router;
