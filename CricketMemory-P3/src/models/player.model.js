const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [50, 'Age cannot exceed 50']
  },
  role: {
    type: String,
    enum: {
      values: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'],
      message: '{VALUE} is not a valid role'
    },
    required: [true, 'Role is required']
  },
  team: {
    type: String,
    required: [true, 'Team is required'],
    trim: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stats: {
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    average: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
