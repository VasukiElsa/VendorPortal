const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');

const getVendorAging = async (req, res) => {
  let userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query parameters' });
  }

  userId = userId.padStart(10, '0');

  const url = `${sapBaseUrl}/VendorPayments_AgingSet?$filter=UserId eq '${userId}'&$format=json`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: sapUsername,
        password: sapPassword
      },
      headers: {
        Accept: 'application/json'
      }
    });

    const results = response.data.d?.results || [];

    const formattedResults = results.map(item => ({
      paymentDoc: item.PaymentDoc,
      docYear: item.DocYear,
      paymentDate: item.PaymentDate,
      userId: item.UserId,
      amountPaid: item.AmountPaid,
      currency: item.Currency,
      clearingDoc: item.ClearingDoc,
      refDocNo: item.RefDocNo,
      dueDate: item.DueDate,
      aging: item.Aging
    }));

    console.log('Vendor Aging:', formattedResults);
    res.json(formattedResults);
  } catch (error) {
    console.error('SAP Vendor Aging Error:', error.message);
    return res.status(error.response?.status || 500).json({
      message: 'Error fetching vendor aging data',
      details: error.response?.data?.error?.message?.value || error.message
    });
  }
};

module.exports = { getVendorAging };
