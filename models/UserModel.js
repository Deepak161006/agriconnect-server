const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ['Producer', 'Consumer'] // Only allows these two values
  }
}, { timestamps: true }); // timestamps adds 'createdAt' and 'updatedAt' fields

module.exports = mongoose.model('User', UserSchema);