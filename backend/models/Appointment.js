const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Please associate a client']
  },
  date: {
    type: Date,
    required: [true, 'Please specify the appointment date']
  },
  time: {
    type: String,
    required: [true, 'Please specify the appointment time']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
