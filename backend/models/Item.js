const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [String],
  expiryDate: { type: Date },
  expiryTime: { type: String },
  createdDate: { type: Date, default: Date.now },
  image: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the bet
});

module.exports = mongoose.model('Item', ItemSchema);
