const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
  },
  balance: {
    type: Number,
    default: 100,
    min: [0, 'Balance cannot be negative'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);