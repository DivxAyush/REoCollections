// ============================================================
// ENV CONFIG — Server
// Validates and exposes environment variables
// ============================================================

const required = (key) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

const optional = (key, defaultValue = '') => process.env[key] || defaultValue

const env = {
  port: parseInt(optional('PORT', '5000'), 10),
  mongoUri: optional('MONGO_URI', 'mongodb://localhost:27017/reo-collection'),
  jwtSecret: optional('JWT_SECRET', 'dev_secret_change_me'),
  jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),
  cloudinaryCloudName: optional('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: optional('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: optional('CLOUDINARY_API_SECRET'),
  clientUrl: optional('CLIENT_URL', 'http://localhost:5173'),
  nodeEnv: optional('NODE_ENV', 'development'),
  isProd: optional('NODE_ENV') === 'production',
  isDev: optional('NODE_ENV', 'development') === 'development',
}

export default env
