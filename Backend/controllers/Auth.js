
const User = require('../models/User');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const OTP = require('../models/OTP');
const { check, validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// Import OTP Templates
const otpVerificationTemplate = require('../helper/OTPVerification');


// ----------------------------------------   Send Email while Registration ---------------------------------------

const sendOTPUsingEmail = async(req, res)=>{
  console.log("Send OTP Request Received:", req.body?.email);

  const { name, email, password, confirmPassword, role, registrationNumber } = req.body;

  if (!name || !email || !password || !confirmPassword || !role){
    return res.status(400).json({
      success: false,
      message: "All fields are mandatory",
    });
  }

  if(password !== confirmPassword){
    return res.status(400).json({
      success: false,
      message: "Password and Confirm Password do not match",
    });
  }

  if(role === "NGO" && !registrationNumber){
    return res.status(400).json({
      success: false,
      message: "Registration Number is required for NGOs",
    });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Generate 6-character hex OTP
    const otp = crypto.randomBytes(3).toString('hex').toLowerCase();

    // Remove any previous OTPs for this email and save new one
    await OTP.deleteMany({ email: normalizedEmail });
    await OTP.create({ email: normalizedEmail, otp });

    // Send OTP via email (or fallback to console for development)
    try {
      const subject = 'SharePlate - Verify your Email';
      const text = `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`;
      const htmlBody = otpVerificationTemplate(name, otp, "verification");
      await sendEmail(normalizedEmail, subject, text, htmlBody);
      console.log(`Email OTP sent successfully to ${normalizedEmail}`);
    } catch (emailErr) {
      console.log(`\n===============================================\n🔑 DEV MODE OTP for ${normalizedEmail}: ${otp}\n===============================================\n`);
    }

    return res.status(200).json({ 
      success: true,
      message: 'OTP sent to your email for verification'
    });

  } 
  catch (err) {
    console.error("sendOTPUsingEmail error:", err);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
};


// ----------------------------------------  Verify email using OTP & Register  ---------------------------------------- 

const OTPVerification = async(req, res)=>{
  try {
    const userData = req.body.userData || req.body;
    const { email, name, password, role, registrationNumber } = userData;
    const otp = (req.body.otp || '').toString().trim().toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP in database
    const storedOTP = await OTP.findOne({ email: normalizedEmail })
      .sort({ createdAt: -1 });

    if (!storedOTP || storedOTP.otp.toLowerCase() !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please try again.' 
      });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      profileImage: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(name)}`,
      registrationNumber: role === "NGO" ? registrationNumber : undefined,
      isVerified: role === "NGO" ? false : true,
    });

    // Save user to database
    await user.save();

    // Clean up OTPs
    await OTP.deleteMany({ email: normalizedEmail });

    // Generate JWT token
    const payload = {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
    }).status(200).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified
      }
    });

  } 
  catch (err) {
    console.error("OTPVerification error:", err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server error',
    });
  }
};


//  ----------------------------------------    Authenticate user and get token   ---------------------------------------- 

const AuthenticateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0]?.msg || 'Validation failed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "User Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error("AuthenticateUser error:", err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};


// ----------------------------------------    Send OTP to user's email for password reset   ---------------------------------------- 
const ForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex').toLowerCase();
    console.log(`Generated reset OTP for ${normalizedEmail}: ${otp}`);

    // Save OTP to database
    await OTP.deleteMany({ email: normalizedEmail });
    await OTP.create({ email: normalizedEmail, otp });

    // Send OTP via email
    const subject = 'SharePlate - Password Reset OTP';
    const htmlBody = otpVerificationTemplate(user.name, otp, 'reset');
    
    try {
      await sendEmail(normalizedEmail, subject, `Your OTP is: ${otp}`, htmlBody);
      console.log(`Reset email sent to ${normalizedEmail}`);
    } catch (emailError) {
      console.log(`\n===============================================\n🔑 DEV MODE RESET OTP for ${normalizedEmail}: ${otp}\n===============================================\n`);
    }

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Error in ForgotPasswordOTP:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error: ' + err.message 
    });
  }
};


// ----------------------------------------   Verify OTP and allow password reset   ---------------------------------------- 

const ForgotPassword = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim().toLowerCase();

    // Find OTP in database
    const storedOTP = await OTP.findOne({ email: normalizedEmail, otp: cleanOtp });
    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// -----------------------------------------  Reset user's password after OTP verification     -----------------------------------------

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate input
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim().toLowerCase();

    // Find OTP in database
    const storedOTP = await OTP.findOne({ email: normalizedEmail, otp: cleanOtp });
    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    await User.findOneAndUpdate({ email: normalizedEmail }, { password: hashedPassword });

    // Delete OTP from database
    await OTP.deleteMany({ email: normalizedEmail });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error in resetPassword:', err.message);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

// -----------------------------------------  Google Login Controller  -----------------------------------------
const googleLogin = async (req, res) => {
  const { credential, role } = req.body;

  try {
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    const googleUser = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` },
    });
    const { email, name, picture } = googleUser.data;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email could not be extracted from Google token' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name: name || 'Google User',
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'Donar',
        profileImage: picture || `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`,
        isVerified: true,
      });

      await user.save();
    }

    const tokenPayload = {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
    }).status(200).json({
      success: true,
      message: "Google Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ success: false, message: 'Google authentication failed: ' + err.message });
  }
};

module.exports = {sendOTPUsingEmail, OTPVerification, AuthenticateUser, ForgotPasswordOTP, ForgotPassword, resetPassword, googleLogin};