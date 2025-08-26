require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const listingRoutes = require('./routes/listings');
const reservationRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => res.send('Healthy'));

const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}
console.log('Attempting connection with MONGO_URI:', MONGO_URI);

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  app.use('/api/listings', listingRoutes);
  app.use('/api/reservations', authenticateToken, reservationRoutes);
  app.use('/api/auth', authRoutes);

  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});