const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure pdfs folder exists
const pdfDir = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

app.use(cors());

const vendorLoginRoute = require('./routes/vendorLoginRoute');
const vendorProfileRoute = require('./routes/vendorProfileRoute');
const vendorRFQRoute = require('./routes/vendorRFQRoute');
const vendorPORoute = require('./routes/vendorPORoute');
const vendorGRRoute = require('./routes/vendorGRRoute');
const vendorInvoiceRoutes = require('./routes/vendorInvoiceRoute');
const vendorPaymentsRoute = require('./routes/vendorPayments');
const vendorMemoRoute = require('./routes/vendorMemoRoute');

;
app.use('', vendorLoginRoute);
app.use('/profile', vendorProfileRoute);
app.use('/rfq', vendorRFQRoute);
app.use('/po', vendorPORoute);
app.use('/gr', vendorGRRoute);
app.use('/invoice', vendorInvoiceRoutes);
app.use('/vendor-payments', vendorPaymentsRoute);
app.use('/vendor-memo', vendorMemoRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Node.js SAP backend running on port ${PORT}`);
});
