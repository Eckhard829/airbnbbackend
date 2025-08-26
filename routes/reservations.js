const express = require('express');
const router = express.Router();
const { createReservation, getReservations, updateReservation } = require('../controllers/reservationController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, createReservation);
router.get('/', authMiddleware, getReservations);
router.put('/:id', authMiddleware, updateReservation);

module.exports = router;