const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
  try {
    const { title, description, price, location, guests, images, specificRatings } = req.body;
    if (!title || !description || !price || !location || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const listing = new Listing({
      title,
      description,
      price: Number(price),
      location: location.trim(),
      guests: Number(guests),
      images: Array.isArray(images) ? images : [images], // Ensure images is an array
      specificRatings: specificRatings || {
        cleanliness: 0, communication: 0, checkin: 0, accuracy: 0, location: 0, value: 0
      },
      createdBy: req.user?.id || 'mockUser'
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { location, guests } = req.query;
    let query = {};
    if (location) query.location = { $regex: location.trim(), $options: 'i' };
    if (guests) query.guests = { $gte: Number(guests) };
    const listings = await Listing.find(query);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Listing.distinct('location');
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, guests, images, specificRatings } = req.body;
    if (!title || !description || !price || !location || !guests) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    listing.title = title;
    listing.description = description;
    listing.price = Number(price);
    listing.location = location.trim();
    listing.guests = Number(guests);
    listing.images = Array.isArray(images) ? images : [images]; // Update images
    listing.specificRatings = specificRatings || listing.specificRatings;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json({ message: 'Listing deleted', listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};