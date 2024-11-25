const express = require('express');
const { authenticate } = require('../../middleware/auth');
const Item = require('../../models/Item');
const Bet = require('../../models/Bet');
const { authorizeAdmin } = require('../../middleware/auth');
const User = require('../../models/User');

const router = express.Router();

// routes/items.js
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
    user.betHistory.push({
      item: item._id,
      amount,
      choice,
      result: 'pending',
    });

    await user.save();

    res.status(200).json({ message: 'Bet placed successfully', newBalance: user.balance });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ error: 'Internal server error while placing bet' });
  }
});



router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, options, expiryDate, expiryTime, image } = req.body;

    // Validate required fields
    if (!title || !description || !options || !expiryDate || !expiryTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure `options` is an array
    const formattedOptions = Array.isArray(options)
      ? options.map((opt) => opt.trim()) // If it's already an array, trim each option
      : options.split(',').map((opt) => opt.trim()); // If it's a string, split and trim

    // Create a new item
    const newItem = new Item({
      title,
      description,
      options: formattedOptions,
      expiryDate,
      expiryTime,
      image: image || 'https://via.placeholder.com/300', // Default image if none provided
      creator: req.user.id, // Associate the logged-in user
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create new item' });
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


// routes/items.js
router.put('/:itemId/result', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { winner } = req.body;

    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.status = 'settled';
    item.result = {
      winner,
      timestamp: new Date(),
    };
    await item.save();

    const users = await User.find({ 'betHistory.item': item._id });

    for (const user of users) {
      user.betHistory.forEach((bet) => {
        if (bet.item.toString() === item._id.toString()) {
          if (bet.choice === winner) {
            // User won: Add double the bet amount
            user.balance += bet.amount * 2;
            bet.result = 'won';
          } else {
            // User lost: Keep balance unchanged
            bet.result = 'lost';
          }
        }
      });
      await user.save();
    }

    res.status(200).json({ message: 'Item settled successfully', item });
  } catch (error) {
    console.error('Error settling item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
