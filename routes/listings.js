const express = require('express');
const router = express.Router();
const { createListing, getListings, getLocations, getListingById, updateListing, deleteListing } = require('../controllers/listingController');

router.post('/', createListing);
router.get('/', getListings);
router.get('/locations', getLocations);
router.get('/:id', getListingById);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);

module.exports = router;