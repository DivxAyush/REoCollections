import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import env from './config/env.js'
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import routes from './routes/index.js'

// ============================================================
// INITIALIZE APP
// ============================================================
const app = express()

// ============================================================
// MIDDLEWARE
// ============================================================
// Security headers
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
)

// Request parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Logging (dev only)
if (env.isDev) {
  app.use(morgan('dev'))
}

// ============================================================
// ROUTES
// ============================================================
// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: env.nodeEnv })
})

// API routes
app.use('/api', routes)

// ============================================================
// ERROR HANDLING
// ============================================================
// Must be last middleware
app.use(errorHandler)

// ============================================================
// START SERVER
// ============================================================
async function startServer() {
  try {
    await connectDB()

    app.listen(env.port, () => {
      console.log(`🚀 Server running in ${env.nodeEnv} mode on port ${env.port}`)
      console.log(`🔗 API accessible at http://localhost:${env.port}/api`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
  // Close server & exit process in production
  if (env.isProd) process.exit(1)
})

startServer()
