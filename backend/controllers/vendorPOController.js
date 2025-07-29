// controllers/vendorPOController.js
const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');

const getVendorPO = async (req, res) => {
  let userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query parameters' });
  }

  userId = userId.padStart(10, '0'); // Ensure 10-digit vendor ID

  const url = `${sapBaseUrl}/VendorPOSet?$filter=UserId eq '${userId}'&$format=json`;

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

    const formattedResults = results.map(po => ({
      poNumber: po.PoNumber,
      userId: po.UserId,
      vendorName: po.VendorName,
      plant: po.Plant,
      poDocDate: new Date(parseInt(po.PoDocDate.match(/\d+/)[0], 10)),
      materialNo: po.MaterialNo,
      materialDesc: po.MaterialDesc,
      orderType: po.OrdType,
      purchasingOrg: po.PurcOrg,
      quantity: po.Quantity,
      netPrice: po.NetPrice,
      netValue: po.NetValue,
      deliveryDate: new Date(parseInt(po.DelDate.match(/\d+/)[0], 10)),
      currency: po.Currency,
      unit: po.Unit
    }));

    // ✅ Print the results in console
    console.log('Fetched Purchase Orders:', formattedResults);

    res.json(formattedResults);
  } catch (error) {
    console.error('Vendor PO Fetch Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: 'SAP PO Fetch Failed',
        details: error.response.data.error?.message?.value || error.message
      });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getVendorPO
};
