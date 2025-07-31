// routes/vendorMemoRoute.js
const express = require('express');
const router = express.Router();
const { getVendorMemos } = require('../controllers/vendorMemoController');

router.get('/get-vendor-memos', getVendorMemos);

module.exports = router;
