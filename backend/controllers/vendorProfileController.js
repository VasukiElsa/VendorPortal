const axios = require('axios');
const { sapBaseUrl, sapUsername, sapPassword } = require('../config/sapConfig');

const getVendorProfile = async (req, res) => {
  let userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId in query parameters' });
  }

  userId = userId.padStart(10, '0'); // SAP expects 10-digit vendor ID

  const url = `${sapBaseUrl}/ProfileVSet(UserId='${userId}')`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: sapUsername,
        password: sapPassword,
      },
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = response.data.d;

    res.json({
      userId: data.UserId,
      name: data.Name,
      telephone: data.Telephone,
      email: data.Email,
      street: data.Street,
      city: data.City,
      country: data.Country,
      pincode: data.Pincode,
    });

  } catch (error) {
    console.error('SAP Profile Fetch Error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        message: 'SAP Profile Fetch Failed',
        details: error.response.data.error?.message?.value || error.message,
      });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = {
  getVendorProfile,
};
