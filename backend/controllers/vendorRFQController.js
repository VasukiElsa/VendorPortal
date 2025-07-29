const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');

const getVendorRFQ = async (req, res) => {
  let userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query parameters' });
  }

  userId = userId.padStart(10, '0'); // Ensure 10-digit format like '0000001000'

  const url = `${sapBaseUrl}/VendorRFQSet?$filter=UserId eq '${userId}'&$format=json`;

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

    const mappedResults = results.map(item => ({
      rfqNumber: item.RfqNumber,
      purOrg: item.PurOrg,
      orgEmail: item.OrgEmail,
      telephone: item.Telephone,
      userId: item.UserId,
      vendorName: item.VendorName,
      materialDes: item.MaterialDes,
      quantity: item.Quantity,
      rfqCreation: new Date(parseInt(item.RfqCreation.match(/\d+/)[0], 10)),
      bidDate: new Date(parseInt(item.BidDate.match(/\d+/)[0], 10)),
      delDate: new Date(parseInt(item.DelDate.match(/\d+/)[0], 10)),
      unit: item.Unit
    }));

    res.json(mappedResults);
  } catch (error) {
    console.error('RFQ Fetch Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: 'SAP RFQ Fetch Failed',
        details: error.response.data.error?.message?.value || error.message
      });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getVendorRFQ
};
