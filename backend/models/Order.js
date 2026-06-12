const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  productName: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Gemstone', 'Rudraksha', 'Crystal', 'Puja Product'],
    required: [true, 'Please specify a category']
  },
  price: {
    type: Number,
    required: [true, 'Please specify the price']
  },
  status: {
    type: String,
    enum: [
      'Order Received',
      'Sourced',
      'Lab Certified',
      'Energized',
      'Shipped',
      'Delivered'
    ],
    default: 'Order Received'
  },
  certificateNo: {
    type: String,
    default: ''
  },
  trackingId: {
    type: String,
    default: ''
  },
  partnerCommission: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
