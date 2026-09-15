const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@collegeexchange.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (existingAdmin) {
      console.log(`[Seed Admin]: Admin user (${adminEmail}) already exists.`);
      process.exit(0);
    }

    const adminUser = await User.create({
      name: 'System Admin',
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      phone: '+1 800-CAMPUS-ADM',
      college: 'University Administration',
      course: 'Administration',
      year: 'Staff',
      role: 'admin',
      isBlocked: false,
    });

    console.log(`[Seed Admin Success]: Created admin user ID: ${adminUser._id}`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Admin Error]: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
