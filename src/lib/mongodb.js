// lib/mongodb.js
// -------------------------------------------------------
// This file handles the MongoDB connection using Mongoose.
// We use a global cache so that in development (hot reload),
// we don't open a new connection on every file change.
// -------------------------------------------------------

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local')
}

// Global cache to reuse the connection across hot reloads in dev
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // If already connected, return the existing connection
  if (cached.conn) return cached.conn

  // If no connection in progress, start one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Don't buffer commands if not connected
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
