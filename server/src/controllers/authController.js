import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// POST /api/auth/register
// ============================================================
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400)
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() })
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409)
  }

  const user = await User.create({ name, email, password })
  const token = generateToken(user._id)

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: user.toSafeObject(),
  })
})

// ============================================================
// POST /api/auth/login
// ============================================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError('Email and password are required', 400)
  }

  // Include password in this query only
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401)
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403)
  }

  const token = generateToken(user._id)

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toSafeObject(),
  })
})

// ============================================================
// POST /api/auth/logout
// ============================================================
export const logout = asyncHandler(async (req, res) => {
  // JWT is stateless — token invalidation is handled client-side
  // Future: implement token blacklist with Redis if needed
  res.json({ success: true, message: 'Logged out successfully' })
})

// ============================================================
// GET /api/auth/me
// ============================================================
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user.toSafeObject(),
  })
})

// ============================================================
// POST /api/auth/forgot-password
// ============================================================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new AppError('Email is required', 400)
  }

  // Don't reveal whether email exists — return success either way
  await User.findOne({ email: email.toLowerCase() })
  // TODO: Generate reset token and send email (Phase 5)

  res.json({
    success: true,
    message: 'If that email exists, a reset link has been sent.',
  })
})

// ============================================================
// POST /api/auth/reset-password
// ============================================================
export const resetPassword = asyncHandler(async (req, res) => {
  // TODO: Implement token verification and password update (Phase 5)
  res.json({ success: true, message: 'Password reset successfully' })
})
