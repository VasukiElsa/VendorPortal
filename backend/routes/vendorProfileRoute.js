const express = require('express');
const router = express.Router();
const { getVendorProfile } = require('../controllers/vendorProfileController');

// GET /vendor-profile?userId=...
router.get('/get-vendor-profile', getVendorProfile);

module.exports = router;
