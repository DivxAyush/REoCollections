import jwt from 'jsonwebtoken'
import env from '../config/env.js'
import User from '../models/User.js'

// ============================================================
// PROTECT — Requires valid JWT
// ============================================================
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.',
      })
    }

    const token = authHeader.split(' ')[1]

    let decoded
    try {
      decoded = jwt.verify(token, env.jwtSecret)
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please sign in again.',
      })
    }

    const user = await User.findById(decoded.userId).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or deactivated.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

// ============================================================
// OPTIONAL AUTH — Attaches user if token present, continues anyway
// ============================================================
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      try {
        const decoded = jwt.verify(token, env.jwtSecret)
        const user = await User.findById(decoded.userId).select('-password')
        if (user && user.isActive) {
          req.user = user
        }
      } catch {
        // Token invalid — just proceed without user
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

// ============================================================
// GENERATE TOKEN
// ============================================================
export function generateToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}
