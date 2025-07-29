const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');

// SAP config (could be moved to a separate config file or env variables)
const SAP_BASE_URL = sapBaseUrl;
const SAP_USERNAME = sapUsername;
const SAP_PASSWORD = sapPassword;

const vendorLogin = async (req, res) => {
  const userId = req.query.userId;
  const password = req.query.password;

  if (!userId || !password) {
    return res.status(400).json({ message: 'Missing userId or password in query parameters' });
  }

  const url = `${SAP_BASE_URL}/VendorLoginSet(UserId='${userId}',Password='${password}')`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
      headers: {
        'Accept': 'application/json',
      }
    });

    const result = response.data.d;
    res.json({
      userId: result.UserId,
      message: result.Password // VALID or INVALID
    });

  } catch (error) {
    console.error('SAP Login Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: 'SAP Login Failed',
        details: error.response.data.error.message.value,
      });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = {
  vendorLogin
};
