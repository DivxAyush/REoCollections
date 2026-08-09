import User from '../models/User.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// PUT /api/users/profile
// ============================================================
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body

  const user = await User.findById(req.user._id)
  if (!user) throw new AppError('User not found', 404)

  if (name) user.name = name
  if (phone !== undefined) user.phone = phone

  await user.save()

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toSafeObject(),
  })
})

// ============================================================
// POST /api/users/addresses
// ============================================================
export const addAddress = asyncHandler(async (req, res) => {
  const { label, name, phone, line1, line2, city, state, pincode, isDefault } = req.body

  const user = await User.findById(req.user._id)

  // If this is the first address or marked as default, unset other defaults
  const isFirstAddress = user.addresses.length === 0
  const setAsDefault = isDefault || isFirstAddress

  if (setAsDefault) {
    user.addresses.forEach((addr) => { addr.isDefault = false })
  }

  user.addresses.push({
    label, name, phone, line1, line2, city, state, pincode, isDefault: setAsDefault
  })

  await user.save()

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    addresses: user.addresses,
  })
})

// ============================================================
// PUT /api/users/addresses/:id
// ============================================================
export const updateAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id
  const { label, name, phone, line1, line2, city, state, pincode, isDefault } = req.body

  const user = await User.findById(req.user._id)
  const address = user.addresses.id(addressId)

  if (!address) throw new AppError('Address not found', 404)

  if (isDefault) {
    user.addresses.forEach((addr) => { addr.isDefault = false })
  }

  if (label) address.label = label
  if (name) address.name = name
  if (phone) address.phone = phone
  if (line1) address.line1 = line1
  if (line2 !== undefined) address.line2 = line2
  if (city) address.city = city
  if (state) address.state = state
  if (pincode) address.pincode = pincode
  if (isDefault !== undefined) address.isDefault = isDefault

  await user.save()

  res.json({
    success: true,
    message: 'Address updated',
    addresses: user.addresses,
  })
})

// ============================================================
// DELETE /api/users/addresses/:id
// ============================================================
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  user.addresses.pull(req.params.id)
  await user.save()

  res.json({
    success: true,
    message: 'Address deleted',
    addresses: user.addresses,
  })
})
