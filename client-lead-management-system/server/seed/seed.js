// Seed script: creates a default admin account and sample leads.
// Run with: npm run seed  (from the server folder)

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Lead = require('../models/Lead');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@minicrm.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const sampleLeads = [
  {
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
    source: 'Website',
    status: 'New',
    message: 'Interested in your premium plan, please share pricing details.',
    followUpDate: daysFromNow(1),
    notes: [],
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    phone: '9123456780',
    source: 'Instagram',
    status: 'Contacted',
    message: 'Saw your Instagram ad, want a demo call.',
    followUpDate: daysFromNow(0),
    notes: [{ text: 'Called on Monday, will follow up after demo.' }],
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '9988776655',
    source: 'Referral',
    status: 'Converted',
    message: 'Referred by an existing client, ready to sign up.',
    followUpDate: null,
    notes: [{ text: 'Signed the contract on 2nd visit.' }],
  },
  {
    name: 'Karan Mehta',
    email: 'karan.mehta@example.com',
    phone: '9012345678',
    source: 'Advertisement',
    status: 'Lost',
    message: 'Was comparing with a competitor, went with someone cheaper.',
    followUpDate: null,
    notes: [{ text: 'Price was the main concern.' }],
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha.iyer@example.com',
    phone: '9765432109',
    source: 'Other',
    status: 'New',
    message: 'Found us through a friend at a networking event.',
    followUpDate: daysFromNow(-2),
    notes: [],
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '9345678901',
    source: 'Website',
    status: 'Contacted',
    message: 'Requested a callback regarding enterprise pricing.',
    followUpDate: daysFromNow(3),
    notes: [{ text: 'Left a voicemail, waiting for callback.' }],
  },
  {
    name: 'Ishita Kapoor',
    email: 'ishita.kapoor@example.com',
    phone: '9223344556',
    source: 'Instagram',
    status: 'New',
    message: 'DMed us asking about the free trial.',
    followUpDate: daysFromNow(2),
    notes: [],
  },
  {
    name: 'Arjun Desai',
    email: 'arjun.desai@example.com',
    phone: '9556677889',
    source: 'Referral',
    status: 'Converted',
    message: 'Referred by Priya Nair, onboarded successfully.',
    followUpDate: null,
    notes: [{ text: 'Onboarding completed, upsell opportunity next quarter.' }],
  },
];

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing Admin and Lead collections...');
    await Admin.deleteMany({});
    await Lead.deleteMany({});

    console.log('Creating default admin account...');
    await Admin.create({
      name: 'CRM Administrator',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    console.log('Inserting sample leads...');
    await Lead.insertMany(sampleLeads);

    console.log('----------------------------------------');
    console.log('Seed complete!');
    console.log(`Admin login email:    ${ADMIN_EMAIL}`);
    console.log(`Admin login password: ${ADMIN_PASSWORD}`);
    console.log(`Sample leads created: ${sampleLeads.length}`);
    console.log('----------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
