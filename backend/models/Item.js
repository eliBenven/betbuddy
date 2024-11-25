// models/Item.js

const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [String],
  expiryDate: { type: Date },
  expiryTime: { type: String },
  createdDate: { type: Date, default: Date.now },
  image: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['open', 'settled'],
    default: 'open',
  },
  result: {
    winner: { type: String }, // Winning option
    timestamp: { type: Date }, // When the result was declared
  },
});

module.exports = mongoose.model('Item', ItemSchema);
