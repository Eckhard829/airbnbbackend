const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Listing' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', reservationSchema);