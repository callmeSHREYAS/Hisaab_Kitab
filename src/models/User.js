// models/User.js
// -------------------------------------------------------
// User schema — supports both:
//   1. Email + Password (manual signup/login)
//   2. Google OAuth (via NextAuth)
// -------------------------------------------------------

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password is optional because Google OAuth users won't have one
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't return password by default in queries
    },

    // Which auth provider was used? 'credentials' or 'google'
    provider: {
      type: String,
      default: 'credentials',
    },

    // Google OAuth profile image URL
    image: String,

    // Business name shown on dashboard
    businessName: {
      type: String,
      default: 'My Business',
    },

    // Phone number for WhatsApp reminders (owner's number)
    phone: String,

    // Preferred language for WhatsApp templates
    language: {
      type: String,
      enum: ['en', 'hi', 'mr', 'ta', 'te', 'gu', 'bn'],
      default: 'en',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
)

// Before saving, hash the password if it was changed
UserSchema.pre('save', async function (next) {
  // Only hash if password was modified (or is new)
  if (!this.isModified('password') || !this.password) return next()

  // Salt rounds = 12 → stronger but slower hashing
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Method to compare entered password with stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Prevent model re-compilation in Next.js dev mode
export default mongoose.models.User || mongoose.model('User', UserSchema)
