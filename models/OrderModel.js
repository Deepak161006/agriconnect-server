const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  consumer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productDetails: {
     name: String,
     quantity: String
  },
  customerName: { type: String, required: true },
  
  // --- THIS IS THE CHANGE ---
  deliveryAddress: {
    houseNo: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  // -------------------------

  status: {
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Delivered'],
    default: 'Processing'
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);