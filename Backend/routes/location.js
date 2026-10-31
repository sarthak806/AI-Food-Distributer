const express = require('express');
const {
  isValidIndianPincode,
  verifyIndianPincode,
} = require('../utils/pincode');

const router = express.Router();

router.get('/pincode/:pincode', async (req, res) => {
  const pincode = String(req.params.pincode || '').trim();

  if (!isValidIndianPincode(pincode)) {
    return res.status(400).json({
      valid: false,
      message: 'Enter a valid six-digit Indian pincode',
    });
  }

  try {
    const valid = await verifyIndianPincode(pincode);

    return res.json({
      valid,
      message: valid
        ? 'Pincode verified'
        : 'Pincode does not exist. Enter a valid pincode.',
    });
  } catch (error) {
    console.error('Pincode lookup failed:', error.message);
    return res.status(503).json({
      valid: false,
      message: 'Pincode could not be verified. Please try again.',
    });
  }
});

module.exports = router;
