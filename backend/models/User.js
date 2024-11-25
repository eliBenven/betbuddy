// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 100 }, // Default starting balance
  betHistory: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      amount: { type: Number },
      choice: { type: String },
      result: { type: String, enum: ['won', 'lost', 'pending'], default: 'pending' },
      date: { type: Date, default: Date.now },
      title: { type: String },
      description: { type: String },
    },
  ],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
