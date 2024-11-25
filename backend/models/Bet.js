// models/Bet.js
const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: { type: [String], required: true, default: [] }, // Default to empty array
  choice: { type: String },
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
  totalWager: { type: Number, required: true },
  image: { type: String },
  result: {
    winner: { type: String },
    timestamp: { type: Date },
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        action: { type: String, enum: ['veto', 'approve'] },
      },
    ],
  },
  status: {
    type: String,
    enum: ['open', 'settled'],
    default: 'open',
  },
});

module.exports = mongoose.model('Bet', BetSchema);
