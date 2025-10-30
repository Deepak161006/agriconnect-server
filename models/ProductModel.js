const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // This links the product to the user who created it
  producer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., "kg", "dozen"
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String } // We'll just store the image URL
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);