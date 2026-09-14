const mongoose = require('mongoose');

const NOTE_SCHEMA = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral', 'Advertisement', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Lost'],
      default: 'New',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: [NOTE_SCHEMA],
      default: [],
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

leadSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
