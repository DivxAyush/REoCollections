import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null }, // Cap for percentage coupons
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    // Admin-ready: target specific users or categories
    eligibleUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    eligibleCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    description: { type: String, default: '' },
  },
  { timestamps: true }
)

couponSchema.index({ code: 1 })
couponSchema.index({ isActive: 1, expiresAt: 1 })

const Coupon = mongoose.model('Coupon', couponSchema)
export default Coupon
