const axios = require('axios');

const isValidIndianPincode = (pincode) => /^[1-9][0-9]{5}$/.test(String(pincode || ''));

const verifyIndianPincode = async (pincode) => {
  if (!isValidIndianPincode(pincode)) {
    return false;
  }

  const response = await axios.get(
    `https://api.postalpincode.in/pincode/${pincode}`,
    { timeout: 8000 },
  );
  const result = response.data?.[0];

  return result?.Status === 'Success' &&
    Array.isArray(result.PostOffice) &&
    result.PostOffice.length > 0;
};

module.exports = {
  isValidIndianPincode,
  verifyIndianPincode,
};
