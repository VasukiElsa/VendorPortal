const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/vendorInvoiceController');

// Dynamic userId
router.get('/fetch-invoice/:userId', invoiceController.fetchInvoices);
router.get('/pdf/:invoiceNumber', invoiceController.servePDF);

module.exports = router;
