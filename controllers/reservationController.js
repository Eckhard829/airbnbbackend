const Reservation = require('../models/Reservation');
const Listing = require('../models/Listing');

exports.createReservation = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests, totalCost: clientTotalCost } = req.body;
    const createdBy = req.user?.id || 'mockUser';
    if (!listingId || !checkIn || !checkOut || !guests || !clientTotalCost) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (guests > listing.guests) return res.status(400).json({ message: `Maximum guests exceeded. Limit is ${listing.guests}` });

    const serverTotalCost = nights * listing.price * guests;
    if (Math.abs(serverTotalCost - clientTotalCost) > 0.01) {
      return res.status(400).json({ message: 'Invalid total cost calculated' });
    }

    const reservation = new Reservation({
      listingId,
      checkIn,
      checkOut,
      guests: Number(guests),
      totalCost: serverTotalCost,
      createdBy
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('listingId', 'title price')
      .populate('createdBy', 'email name');
    res.json(reservations.map(r => ({
      ...r.toObject(),
      createdById: r.createdBy?._id?.toString() || null
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    const listing = await Listing.findById(reservation.listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (guests > listing.guests) return res.status(400).json({ message: `Maximum guests exceeded. Limit is ${listing.guests}` });

    const newTotalCost = nights * listing.price * guests;
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { checkIn, checkOut, guests: Number(guests), totalCost: newTotalCost },
      { new: true, runValidators: true }
    );
    res.json(updatedReservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};