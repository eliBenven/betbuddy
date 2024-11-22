// models/Bet.js
const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [String], // Example: ['Over', 'Under']
  expiryDate: { type: Date },
  expiryTime: { type: String },
  createdDate: { type: Date, default: Date.now },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      choice: { type: String },
      amount: { type: Number },
      placedAt: { type: Date, default: Date.now },
    },
  ],
  totalWager: { type: Number, required: true }, // Total wager pool
  image: { type: String },
  result: { type: String }, // Outcome of the bet
});

module.exports = mongoose.model('Bet', BetSchema);
