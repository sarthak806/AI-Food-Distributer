/**
 * Run this script once to create the admin account.
 * Usage: node scripts/createAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: String,
  role: { type: String, enum: ['Donar', 'NGO', 'Admin'] },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// ─── CHANGE THESE IF YOU WANT ──────────────────────────────────────
const ADMIN_EMAIL = 'admin@shareplate.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'SharePlate Admin';
// ───────────────────────────────────────────────────────────────────

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role !== 'Admin') {
        // Upgrade existing user to Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
        existing.role = 'Admin';
        existing.isVerified = true;
        existing.password = hashedPassword;
        await existing.save();
        console.log(`🔄 Upgraded existing user to Admin: ${ADMIN_EMAIL}`);
      } else {
        console.log(`ℹ️  Admin account already exists: ${ADMIN_EMAIL}`);
      }
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'Admin',
      profileImage: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(ADMIN_NAME)}`,
      isVerified: true,
    });

    await admin.save();

    console.log('\n🎉 Admin account created successfully!');
    console.log('──────────────────────────────────────');
    console.log(`📧 Email   : ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log('──────────────────────────────────────');
    console.log('Login at: http://localhost:5173/user/login');
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdmin();
