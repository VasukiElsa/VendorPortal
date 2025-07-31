// controllers/vendorMemoController.js
const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');

const getVendorMemos = async (req, res) => {
  let userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query parameters' });
  }

  // Pad userId to match SAP format (10 digits)
  userId = userId.padStart(10, '0');

  const url = `${sapBaseUrl}/VendorCDMemoSet?$filter=UserId eq '${userId}'&$format=json`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: sapUsername,
        password: sapPassword,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const results = response.data.d?.results || [];

    const formattedMemos = results.map((item) => ({
      memoDocumentNo: item.MemoDocumentNo,
      documentYear: item.DocumentYear,
      postingDate: item.PostingDate,
      userId: item.UserId,
      entryDate: item.EntryDate,
      memoType: item.MemoType,
      amount: item.Amount,
      currency: item.Currency,
      refDocNo: item.RefDocNo,
      docType: item.DocType,
      companyCode: item.CompanyCode,
    }));

    res.json(formattedMemos);
  } catch (error) {
    console.error('SAP Vendor Memo Error:', error.message);
    return res.status(error.response?.status || 500).json({
      message: 'Error fetching vendor credit/debit memo data',
      details: error.response?.data?.error?.message?.value || error.message,
    });
  }
};

module.exports = { getVendorMemos };
