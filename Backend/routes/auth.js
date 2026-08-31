const express = require('express');
const router = express.Router();

const {
  sendOTPUsingEmail, 
  OTPVerification, 
  AuthenticateUser, 
  ForgotPasswordOTP, 
  ForgotPassword, 
  resetPassword, 
  googleLogin
} = require('../controllers/Auth');

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', googleLogin);

// @route   POST /api/auth/send-otp
// @desc    Register a new user with email verification
// @access  Public
router.post('/send-otp', sendOTPUsingEmail);

// @route   POST /api/auth/verify-otp (and /verify-email)
// @desc    Verify email using OTP during registration
// @access  Public
router.post('/verify-otp', OTPVerification);
router.post('/verify-email', OTPVerification);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', AuthenticateUser);

// @route   POST /api/auth/forgot-password
// @desc    Send OTP to user's email for password reset
// @access  Public
router.post('/forgot-password', ForgotPasswordOTP);

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post('/verify-reset-otp', ForgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset user's password after OTP verification
// @access  Public
router.post('/reset-password', resetPassword);

module.exports = router;