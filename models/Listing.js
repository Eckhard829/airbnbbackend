const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true, trim: true },
  guests: { type: Number, required: true },
  images: [String],
  specificRatings: {
    cleanliness: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    checkin: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    value: { type: Number, default: 0 }
  },
  createdBy: { type: String, default: 'mockUser' }
});

module.exports = mongoose.model('Listing', listingSchema);