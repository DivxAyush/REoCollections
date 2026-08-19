import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// GET /api/wishlist
// ============================================================
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('products', 'name slug price compareAtPrice images rating reviewCount newArrival bestSeller stock isActive')
    .lean()

  if (!wishlist) {
    return res.json({ success: true, wishlist: { products: [] } })
  }

  // Filter active products
  wishlist.products = wishlist.products.filter(p => p && p.isActive)

  res.json({ success: true, wishlist })
})

// ============================================================
// POST /api/wishlist
// ============================================================
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) throw new AppError('Product not found or inactive', 404)

  let wishlist = await Wishlist.findOne({ user: req.user._id })

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    })
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId)
      await wishlist.save()
    }
  }

  res.json({
    success: true,
    message: 'Added to wishlist',
    wishlist
  })
})

// ============================================================
// DELETE /api/wishlist/:productId
// ============================================================
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params

  const wishlist = await Wishlist.findOne({ user: req.user._id })
  if (!wishlist) throw new AppError('Wishlist not found', 404)

  const idx = wishlist.products.indexOf(productId)
  if (idx > -1) {
    wishlist.products.splice(idx, 1)
    await wishlist.save()
  }

  res.json({
    success: true,
    message: 'Removed from wishlist',
    wishlist
  })
})
