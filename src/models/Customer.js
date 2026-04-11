// models/Customer.js
// -------------------------------------------------------
// Each user (business owner) can have multiple customers.
// Customers have a pending balance that can be reminded via WhatsApp.
// -------------------------------------------------------

import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema(
  {
    // Which business owner this customer belongs to
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index for faster queries
    },

    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },

    // WhatsApp-capable phone number (with country code e.g. +919876543210)
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },

    // Outstanding amount this customer owes
    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total amount paid so far
    totalPaid: {
      type: Number,
      default: 0,
    },

    // Notes about this customer
    notes: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)
