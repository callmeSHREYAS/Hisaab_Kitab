// models/Order.js
// -------------------------------------------------------
// Records each sale/order made by the business owner.
// Used to calculate today's earnings, monthly totals, etc.
// -------------------------------------------------------

import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },

    customerName: String, // Denormalized for quick display

    // What was sold
    description: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment status
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial'],
      default: 'pending',
    },

    // Amount received (for partial payments)
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt = order date
  }
)

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

// -------------------------------------------------------
// Inventory Item Schema
// -------------------------------------------------------

const InventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Current stock quantity
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    unit: {
      type: String,
      default: 'pieces', // kg, litre, pieces, etc.
    },

    // When quantity falls at or below this, show restock alert
    restockThreshold: {
      type: Number,
      default: 5,
    },

    // Optional: cost per unit for tracking expenses
    costPerUnit: Number,
  },
  {
    timestamps: true,
  }
)

export const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema)
