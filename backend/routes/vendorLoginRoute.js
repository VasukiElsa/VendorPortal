const express = require('express');
const router = express.Router();
const { vendorLogin } = require('../controllers/vendorLoginController');

// GET /api/vendor-login?userId=...&password=...
router.get('/vendor-login', vendorLogin);

module.exports = router;
