const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  consumer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  producer: { // We store this to easily find orders for a producer
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // We store a copy of the details in case the original product is deleted
  productDetails: {
     name: String,
     quantity: String // e.g., "10kg" or "2 dozen"
  },
  customerName: { type: String, required: true }, // From the consumer who ordered
  status: {
    type: String,
    required: true,
    enum: ['Processing', 'Shipped', 'Delivered'],
    default: 'Processing'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);