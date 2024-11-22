// models/Bet.js
const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [String], // Example: ['Over', 'Under']
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
  totalWager: { type: Number, required: true }, // Total wager pool
  image: { type: String },
  result: {
    winner: { type: String }, // Example: "Over"
    timestamp: { type: Date }, // When the result was declared
  },
  status: {
  type: String, 
  enum: ['open', 'closed', 'settled'], 
  default: 'open',
},


  odds: {
    Over: { type: Number },
    Under: { type: Number },
  },
  
});

module.exports = mongoose.model('Bet', BetSchema);
