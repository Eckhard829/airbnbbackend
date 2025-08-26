const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const Reservation = require('./models/Reservation');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Seeding database...');

  // Clear existing data
  await Listing.deleteMany();
  await Reservation.deleteMany();
  await User.deleteMany();

  // Add Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const hostPassword = await bcrypt.hash('host123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  const users = await User.create([
    { email: 'admin@example.com', password: adminPassword, name: 'Admin User', isAdmin: true, role: 'admin' },
    { email: 'host@host.com', password: host123, name: 'Host User', isAdmin: false, role: 'host' },
    { email: 'user@example.com', password: userPassword, name: 'Regular User', isAdmin: false, role: 'user' }
  ]);

  // Add Listings
  const hostUser = users.find(u => u.email === 'host@host.com');
  await Listing.create([
    {
      title: 'Paris Apartment',
      description: 'Cozy apartment in Paris',
      price: 120,
      location: 'Paris',
      guests: 2,
      images: ['paris-apartment.jpg'],
      specificRatings: {
        cleanliness: 4.5, communication: 4.7, checkin: 4.8, accuracy: 4.6, location: 4.9, value: 4.5
      },
      createdBy: hostUser._id
    },
    {
      title: 'Tokyo Loft',
      description: 'Modern loft in Tokyo',
      price: 150,
      location: 'Tokyo',
      guests: 3,
      images: ['tokyo-loft.jpg'],
      specificRatings: {
        cleanliness: 4.8, communication: 4.9, checkin: 4.7, accuracy: 4.8, location: 4.6, value: 4.7
      },
      createdBy: hostUser._id
    }
  ]);

  // Add Reservation
  const user = users.find(u => u.email === 'user@example.com');
  const listing = await Listing.findOne({ title: 'Paris Apartment' });
  await Reservation.create({
    listingId: listing._id,
    checkIn: new Date('2025-06-17'),
    checkOut: new Date('2025-06-23'),
    guests: 2,
    totalCost: 1050,
    createdBy: user._id
  });

  console.log('Database seeded successfully');
  mongoose.connection.close();
}).catch(err => {
  console.error('Seeding error:', err.message);
  mongoose.connection.close();
});