// /lib/database.ts
import mongoose, { Mongoose } from 'mongoose'

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI

// Extend the global object to include our mongoose cache
declare global {
  var mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

// Check if the URI is defined, and if not, throw an error
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Global variable to cache the database connection
// This prevents multiple connections during development with hot-reloading
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Connects to the MongoDB database using the URI from environment variables.
 * Caches the connection to prevent re-establishing a connection on every request.
 * @returns The active Mongoose connection object.
 */
export async function connectDB() {
  // If a connection already exists, return the cached connection
  if (cached.conn) {
    return cached.conn
  }

  // If there is no promise to connect, create a new connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disables Mongoose buffering
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  // Await the connection promise and store the connection object
  cached.conn = await cached.promise
  return cached.conn
}
