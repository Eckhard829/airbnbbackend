require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const listingRoutes = require('./routes/listings');
const reservationRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth');
const { authMiddleware } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/', (req, res) => res.send('Airbnb Backend API - Healthy'));

// Check for required environment variables
const { MONGO_URI, JWT_SECRET } = process.env;
if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env');
  process.exit(1);
}

console.log('Attempting connection with MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/listings', listingRoutes);
  app.use('/api/reservations', reservationRoutes); // Auth middleware is applied in the route file

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});