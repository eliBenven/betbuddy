const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdDate: { type: Date, default: Date.now },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['admin', 'member'], default: 'member' }, // Role within the group
    },
  ],
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }], // Associated bets within the group
});

module.exports = mongoose.model('Group', GroupSchema);
