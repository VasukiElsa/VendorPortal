const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');

const getVendorGR = async (req, res) => {
  let userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query parameters' });
  }

  userId = userId.padStart(10, '0'); // Ensure 10-digit LIFNR

  const url = `${sapBaseUrl}/VendorGRSet?$filter=UserId eq '${userId}'&$format=json`;

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

    const formattedResults = results.map(gr => ({
      materialDocNo: gr.MaterialDocNo,
      materialDocYear: gr.MaterialDocYear,
      postingDate: gr.PostingDate,
      entryDate: gr.EntryDate,
      docType: gr.DocType,
      transactionType: gr.TransactionType,
      materialNo: gr.MaterialNo,
      materialDes: gr.MaterialDes,
      plant: gr.Plant,
      storageLocation: gr.StorageLocation,
      quantity: gr.Quantity,
      baseUnitMeasure: gr.BaseUnitMeasure,
      purchaseOrderNo: gr.PurchaseOrderNo,
      purchaseDocItem: gr.PurchaseDocItem,
      debitOrCreditIndicator: gr.DebitOrCreditIndicator,
      userId: gr.UserId,
      username: gr.Username,
      purOrg: gr.PurOrg,
      amtLocalCurr: gr.AmtLocalCurr
    }));

    console.log('Fetched Vendor GR:', formattedResults);

    res.json(formattedResults);
  } catch (error) {
    console.error('Vendor GR Fetch Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: 'SAP GR Fetch Failed',
        details: error.response.data.error?.message?.value || error.message
      });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getVendorGR
};
