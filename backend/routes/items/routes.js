const express = require('express');
const { authenticate } = require('../../middleware/auth');
const Item = require('../../models/Item');
const Bet = require('../../models/Bet');
const { authorizeAdmin } = require('../../middleware/auth');

const router = express.Router();

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

    // Create or update the Bet for the chosen option
    let bet = await Bet.findOne({ creator: item._id, 'participants.user': req.user.id });

    if (bet) {
      return res.status(400).json({ error: 'You have already placed a bet on this item' });
    }

    // Create a new Bet for this choice
    bet = new Bet({
      title: item.title,
      description: item.description,
      expiryDate: item.expiryDate,
      expiryTime: item.expiryTime,
      creator: item.creator, // User who created the item
      participants: [
        {
          user: req.user.id,
          choice,
          amount,
        },
      ],
      totalWager: amount, // Total wager for this bet
      image: item.image,
      choice: item.choice
    });

    await bet.save();

    res.status(200).json({
      message: 'Bet placed successfully',
      itemId: item._id,
      choice,
      amount,
    });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ error: 'Internal server error while placing bet' });
  }
});


router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, options, expiryDate, expiryTime, image } = req.body;

    const newItem = new Item({
      title,
      description,
      options,
      expiryDate,
      expiryTime,
      image,
      creator: req.user.id, // Associate the logged-in user
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(400).json({ error: err.message });
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

    console.log(`Attempting to delete item with ID: ${id}`);

    // Check if the item exists
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      console.error(`Item not found with ID: ${id}`);
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log(`Item deleted successfully: ${deletedItem}`);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('creator', 'username email'); // Include username and email
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Error fetching items' });
  }
});



module.exports = router;
