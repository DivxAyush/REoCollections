import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// GET /api/orders
// ============================================================
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(parseInt(limit, 10), 50)
  const skip = (pageNum - 1) * limitNum

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments({ user: req.user._id }),
  ])

  res.json({
    success: true,
    orders,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  })
})

// ============================================================
// GET /api/orders/:id
// ============================================================
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id, // Ensure user owns order
  }).lean()

  if (!order) {
    throw new AppError('Order not found', 404)
  }

  res.json({ success: true, order })
})

// ============================================================
// POST /api/orders
// ============================================================
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod' } = req.body

  // Get cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty', 400)
  }

  // Calculate totals and verify stock
  let subtotal = 0
  const orderItems = []

  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw new AppError(`Product ${item.product ? item.product.name : 'Unknown'} is no longer available`, 400)
    }
    if (item.product.stock < item.quantity) {
      throw new AppError(`Not enough stock for ${item.product.name}`, 400)
    }

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
      status: paymentMethod === 'cod' ? 'pending' : 'paid',
    },
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

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  })
})

// ============================================================
// POST /api/orders/:id/cancel
// ============================================================
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  })

  if (!order) {
    throw new AppError('Order not found', 404)
  }

  if (order.status !== 'pending' && order.status !== 'processing') {
    throw new AppError('Order cannot be cancelled at this stage', 400)
  }

  order.status = 'cancelled'
  await order.save()

  // Optionally, restore stock here if needed
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    })
  }

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    order
  })
})
