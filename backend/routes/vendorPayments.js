const express = require('express');
const router = express.Router();
const { getVendorAging } = require('../controllers/vendorPaymentsController');

router.get('/get-vendor-aging', getVendorAging);

module.exports = router;
