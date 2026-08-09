import mongoose from 'mongoose'
import env from './env.js'

let isConnected = false

export async function connectDB() {
  if (isConnected) return

  try {
    const conn = await mongoose.connect(env.mongoUri, {
      dbName: 'reo-collection',
    })

    isConnected = true
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
      isConnected = false
    })
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
