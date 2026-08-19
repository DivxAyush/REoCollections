import 'dotenv/config'
import mongoose from 'mongoose'
import User from './src/models/User.js'

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to DB')

    const adminExists = await User.findOne({ email: 'ayush2133k@reo.com' })
    if (adminExists) {
      console.log('Admin user already exists')
    } else {
      await User.create({
        name: 'Super Admin',
        email: 'ayush2133k@reo.com',
        password: 'qwerty123',
        phone: '9999999999',
        role: 'admin',
        isActive: true,
      })
      console.log('Admin user created successfully!')
    }
    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
