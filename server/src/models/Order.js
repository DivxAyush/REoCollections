import mongoose from 'mongoose'

// ============================================================
// ORDER ITEM SUB-SCHEMA
// ============================================================
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Snapshot fields — preserved even if product changes
    name: { type: String, required: true },
    image: { type: String, default: '' },
    slug: { type: String, default: '' },
    color: { type: String, default: '' },
    size: { type: String, default: '' },
    sku: { type: String, default: '' },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

// ============================================================
// ADDRESS SNAPSHOT
// ============================================================
const addressSnapshotSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false }
)

// ============================================================
// PAYMENT INFO
// ============================================================
const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['cod', 'upi', 'card', 'netbanking', 'wallet'],
      default: 'cod',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: { type: String, default: '' },
    paidAt: { type: Date, default: null },
    gateway: { type: String, default: '' },
  },
  { _id: false }
)

// ============================================================
// ORDER SCHEMA
// ============================================================
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: addressSnapshotSchema,
    payment: paymentSchema,

    // Server-computed totals — NEVER trust client values
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    couponCode: { type: String, default: '' },
    couponDiscount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
        'refunded',
      ],
      default: 'pending',
    },

    // Delivery tracking
    trackingNumber: { type: String, default: '' },
    carrier: { type: String, default: '' },
    estimatedDelivery: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },

    // Admin notes
    notes: { type: String, default: '' },
    cancelReason: { type: String, default: '' },
  },
  { timestamps: true }
)

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ status: 1 })

// Auto-generate order number
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    this.orderNumber = `REO-${timestamp}-${random}`
  }
  next()
})

const Order = mongoose.model('Order', orderSchema)
export default Order
