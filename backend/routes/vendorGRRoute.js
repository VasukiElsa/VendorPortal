const express = require('express');
const router = express.Router();
const { getVendorGR } = require('../controllers/vendorGRController');

router.get('/get-vendor-gr', getVendorGR);

module.exports = router;
