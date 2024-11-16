const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'] },
  age: { type: Number, required: true },
  address: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
