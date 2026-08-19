import crypto from 'crypto'
import Razorpay from 'razorpay'
import razorpayInstance from '../config/razorpay.js'
import env from '../config/env.js'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// POST /api/payment/razorpay/create-order
// ============================================================
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!razorpayInstance) {
    throw new AppError('Razorpay is not configured on the server', 500)
  }

  // Calculate amount from cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty', 400)
  }

  let subtotal = 0
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw new AppError(`Product ${item.product ? item.product.name : 'Unknown'} is unavailable`, 400)
    }
    if (item.product.stock < item.quantity) {
      throw new AppError(`Not enough stock for ${item.product.name}`, 400)
    }
    subtotal += item.product.price * item.quantity
  }

  const deliveryCharge = subtotal > 999 ? 0 : 50
  const total = subtotal + deliveryCharge

  // Create order on Razorpay
  const options = {
    amount: total * 100, // Razorpay works in paise
    currency: 'INR',
    receipt: `rcpt_${req.user._id}_${Date.now()}`,
  }

  const razorpayOrder = await razorpayInstance.orders.create(options)

  res.json({
    success: true,
    order_id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  })
})

// ============================================================
// POST /api/payment/razorpay/verify
// ============================================================
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    shippingAddress,
    paymentMethod = 'card' // card, upi, netbanking mapped to card/upi in UI
  } = req.body

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    throw new AppError('Invalid payment details', 400)
  }

  // Verify Signature
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', env.razorpayKeySecret)
    .update(body.toString())
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    throw new AppError('Invalid payment signature', 400)
  }

  // Signature is valid. Create the Order in our DB.
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400)
  }

  let subtotal = 0
  const orderItems = []

  for (const item of cart.items) {
    if (!item.product) continue

    const price = item.product.price
    subtotal += price * item.quantity

    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0]?.url || '',
      slug: item.product.slug,
      color: item.color,
      size: item.size,
      sku: item.product.sku,
      price,
      compareAtPrice: item.product.compareAtPrice,
      quantity: item.quantity,
    })
  }

  const deliveryCharge = subtotal > 999 ? 0 : 50
  const total = subtotal + deliveryCharge

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    payment: {
      method: paymentMethod,
      status: 'paid',
      transactionId: razorpay_payment_id,
      paidAt: Date.now(),
      gateway: 'razorpay'
    },
    status: 'confirmed',
    subtotal,
    deliveryCharge,
    total,
  })

  // Decrement stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }
    })
  }

  // Clear cart
  cart.items = []
  await cart.save()

  res.json({
    success: true,
    message: 'Payment verified and order created',
    order,
  })
})
