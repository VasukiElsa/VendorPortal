const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');
const fs = require('fs');
const path = require('path');

const SAP_AUTH = {
  username: sapUsername,
  password: sapPassword
};

let pdfStore = {};

exports.fetchInvoices = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User_Id is required in the URL.' });
  }

  const SAP_URL = `${sapBaseUrl}/VendorInvoiceSet?$filter=User_Id eq '${userId}'&$format=json`;

  try {
    const response = await axios.get(SAP_URL, {
      auth: SAP_AUTH,
      headers: {
        'Accept': 'application/json'
      }
    });

    const results = response.data.d.results;
    const output = [];

    results.forEach(invoice => {
      const {
        User_Id,
        Invoice_number,
        Invoice_Date,
        Organization,
        Pdf_Content
      } = invoice;

      const buffer = Buffer.from(Pdf_Content, 'base64');
      const filePath = path.join(__dirname, '../pdfs', `${Invoice_number}.pdf`);
      fs.writeFileSync(filePath, buffer);
      pdfStore[Invoice_number] = filePath;

      console.log("========== Invoice ==========");
      console.log(`User_Id      : ${User_Id}`);
      console.log(`Invoice No   : ${Invoice_number}`);
      console.log(`Invoice Date : ${Invoice_Date}`);
      console.log(`Organization : ${Organization}`);

      output.push({
        User_Id,
        Invoice_number,
        Invoice_Date,
        Organization,
        pdf_url: `/pdf/${Invoice_number}`
      });
    });

    res.json({
      message: `Invoices for User_Id ${userId} fetched.`,
      invoices: output
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch invoices from SAP' });
  }
};

exports.servePDF = (req, res) => {
  const invoiceNumber = req.params.invoiceNumber;
  const filePath = pdfStore[invoiceNumber];

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).send('PDF not found');
  }

  res.sendFile(path.resolve(filePath));
};
