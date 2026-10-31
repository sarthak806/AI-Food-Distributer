// In Donation.js

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  foodType: { type: String, required: true },
  category: { type: String, required: true },
  otherCategory: { type: String, default: '' },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  dietaryCategory: { type: String, required: true },
  allergens: { type: String, required: true },
  preparationDate: { type: Date },
  storageCondition: { type: String, required: true },
  otherStorage: { type: String, default: '' },
  packagingStatus: { type: String, required: true },
  packagingNotes: { type: String, default: '' },
  expirationDate: { type: Date, required: true },
  pickupStart: { type: Date, required: true },
  pickupEnd: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  pickupArea: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  pickupInstructions: { type: String, default: '' },
  safetyConfirmedAt: { type: Date, required: true },
  name:{
    type:String,
    default: "Food",
  },
  description: { type: String }, // Add description field
  imageUrl: { type: String },
  images: [{ type: String }],
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //store the reciver id also but not required
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // for status keep 3 values : accepted, delivered, pending
  status: { type: String, enum: ['pending', 'accepted', 'delivered'], default: 'pending' },
  otp: { 
    type: String,
    default: null 
  },
  otpExpires: { 
    type: Date,
    default: null 
  },
  createdAt: { type: Date, default: Date.now },
});

// At the end of your schema file (document #2)
const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;