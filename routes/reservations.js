const express = require('express');
const router = express.Router();
const { createReservation, getReservations, updateReservation } = require('../controllers/reservationsController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/', authenticateToken, createReservation);
router.get('/', authenticateToken, getReservations);
router.put('/:id', authenticateToken, updateReservation);

module.exports = router;