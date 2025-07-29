// routes/vendorPORoute.js
const express = require('express');
const router = express.Router();
const { getVendorPO } = require('../controllers/vendorPOController');

// GET /po?userId=...
router.get('/get-vendor-po', getVendorPO);

module.exports = router;
