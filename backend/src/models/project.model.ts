import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  boardColumns: [{
    name: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    tickets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Project = mongoose.model('Project', projectSchema); 