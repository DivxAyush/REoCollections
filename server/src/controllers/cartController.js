import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// GET /api/cart
// ============================================================
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate('items.product', 'name slug price images stock isActive')
    .lean()

  if (!cart) {
    // Return empty cart structure if none exists
    return res.json({ success: true, cart: { items: [], total: 0 } })
  }

  // Filter out items where product no longer exists or is inactive
  const validItems = cart.items.filter((item) => item.product && item.product.isActive)

  // Calculate current total based on latest product prices
  const total = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  res.json({
    success: true,
    cart: {
      ...cart,
      items: validItems,
      total,
    },
  })
})

// ============================================================
// POST /api/cart
// ============================================================
export const addToCart = asyncHandler(async (req, res) => {
  // Check if this is a bulk sync
  if (req.body.items && Array.isArray(req.body.items)) {
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    for (const item of req.body.items) {
      const product = await Product.findOne({ _id: item.productId, isActive: true })
      if (!product) continue

      const variantKey = item.variant
        ? `${item.variant.color || ''}_${item.variant.size || ''}`
        : 'default'

      const itemIndex = cart.items.findIndex(
        (i) =>
          i.product.toString() === item.productId &&
          i.color === (item.variant?.color || undefined) &&
          i.size === (item.variant?.size || undefined) &&
          (item.variant?.variantId ? i.variantId?.toString() === item.variant.variantId : true)
      )

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + item.quantity
        cart.items[itemIndex].quantity = Math.min(newQuantity, product.stock)
        cart.items[itemIndex].priceSnapshot = product.price
      } else {
        cart.items.push({
          product: item.productId,
          quantity: Math.min(item.quantity, product.stock),
          color: item.variant?.color,
          size: item.variant?.size,
          variantId: item.variant?.variantId,
          priceSnapshot: product.price,
        })
      }
    }
    await cart.save()
    await cart.populate('items.product', 'name slug price images stock isActive')
    return res.json({ success: true, message: 'Cart synced', cart })
  }

  // Single item add
  const { productId, quantity = 1, color, size, variantId } = req.body

  if (quantity < 1) throw new AppError('Quantity must be at least 1', 400)

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) throw new AppError('Product not found or inactive', 404)
  if (product.stock < quantity) throw new AppError('Not enough stock available', 400)

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: productId,
          quantity,
          color,
          size,
          variantId,
          priceSnapshot: product.price,
        },
      ],
    })
  } else {
    // Check if item already exists in cart (matching product + variant specs)
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size &&
        (variantId ? item.variantId?.toString() === variantId : true)
    )

    if (itemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[itemIndex].quantity + quantity
      if (product.stock < newQuantity) {
        throw new AppError('Not enough stock for this quantity', 400)
      }
      cart.items[itemIndex].quantity = newQuantity
      cart.items[itemIndex].priceSnapshot = product.price // update price snapshot
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        color,
        size,
        variantId,
        priceSnapshot: product.price,
      })
    }
    await cart.save()
  }

  // Re-fetch populated cart
  await cart.populate('items.product', 'name slug price images stock isActive')

  res.json({
    success: true,
    message: 'Added to cart',
    cart,
  })
})

// ============================================================
// PUT /api/cart/:itemId
// ============================================================
export const updateCartItem = asyncHandler(async (req, res) => {
  const itemId = req.params.itemId
  const { quantity } = req.body

  if (quantity < 1) throw new AppError('Quantity must be at least 1', 400)

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product')
  if (!cart) throw new AppError('Cart not found', 404)

  const item = cart.items.id(itemId)
  if (!item) throw new AppError('Item not found in cart', 404)

  if (item.product.stock < quantity) {
    throw new AppError('Not enough stock available', 400)
  }

  item.quantity = quantity
  await cart.save()

  res.json({
    success: true,
    message: 'Cart updated',
    cart,
  })
})

// ============================================================
// DELETE /api/cart/:itemId
// ============================================================
export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) throw new AppError('Cart not found', 404)

  cart.items.pull(req.params.itemId)
  await cart.save()
  await cart.populate('items.product', 'name slug price images stock isActive')

  res.json({
    success: true,
    message: 'Item removed',
    cart,
  })
})

// ============================================================
// DELETE /api/cart/clear
// ============================================================
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (cart) {
    cart.items = []
    await cart.save()
  }

  res.json({ success: true, message: 'Cart cleared', cart: { items: [], total: 0 } })
})
