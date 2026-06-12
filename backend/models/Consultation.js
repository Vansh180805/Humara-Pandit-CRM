const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Please associate a client']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    required: [true, 'Please add discussion notes']
  },
  remedies: {
    gemstones: [String],
    rudrakshas: [String],
    crystals: [String]
  },
  followUpDate: {
    type: Date
  },
  followUpStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'None'],
    default: 'None'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
