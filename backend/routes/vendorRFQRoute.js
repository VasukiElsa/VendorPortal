const express = require('express');
const router = express.Router();
const { getVendorRFQ } = require('../controllers/vendorRFQController');

// GET /rfq?vendorId=100000
router.get('/get-vendor-rfq', getVendorRFQ);

module.exports = router;
