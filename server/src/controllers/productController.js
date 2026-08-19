import Product from '../models/Product.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

const DEFAULT_PAGE_SIZE = 12

// ============================================================
// GET /api/products
// ============================================================
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = DEFAULT_PAGE_SIZE,
    category,
    sort = 'createdAt',
    order = 'desc',
    minPrice,
    maxPrice,
    sizes,
    colors,
    rating,
    inStock,
    search,
    featured,
    newArrival,
    bestSeller,
  } = req.query

  const query = { isActive: true }

  if (category) query.category = category
  if (featured === 'true') query.featured = true
  if (newArrival === 'true') query.newArrival = true
  if (bestSeller === 'true') query.bestSeller = true
  if (inStock === 'true') query.stock = { $gt: 0 }
  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }
  if (sizes) query.sizes = { $in: sizes.split(',') }
  if (colors) query.colors = { $in: colors.split(',') }
  if (rating) query.rating = { $gte: Number(rating) }
  if (search) query.$text = { $search: search }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    popularity: { reviewCount: -1 },
    recommended: { sortWeight: -1, createdAt: -1 },
  }

  const sortQuery = sortMap[sort] || { [sort]: order === 'asc' ? 1 : -1 }

  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(parseInt(limit, 10), 48)
  const skip = (pageNum - 1) * limitNum

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug')
      .lean(),
    Product.countDocuments(query),
  ])

  res.json({
    success: true,
    products,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    limit: limitNum,
  })
})

// ============================================================
// GET /api/products/:slug
// ============================================================
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate('category', 'name slug')

  if (!product) {
    throw new AppError('Product not found', 404)
  }

  res.json({ success: true, product })
})

// ============================================================
// GET /api/products/featured
// ============================================================
export const getFeatured = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '8', 10), 20)

  const products = await Product.find({ isActive: true, featured: true })
    .sort({ sortWeight: -1, createdAt: -1 })
    .limit(limit)
    .populate('category', 'name slug')
    .lean()

  res.json({ success: true, products })
})

// ============================================================
// GET /api/products/new-arrivals
// ============================================================
export const getNewArrivals = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '8', 10), 20)

  const products = await Product.find({ isActive: true, newArrival: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category', 'name slug')
    .lean()

  res.json({ success: true, products })
})

// ============================================================
// GET /api/products/best-sellers
// ============================================================
export const getBestSellers = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '8', 10), 20)

  const products = await Product.find({ isActive: true, bestSeller: true })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit)
    .populate('category', 'name slug')
    .lean()

  res.json({ success: true, products })
})

// ============================================================
// GET /api/products/search
// ============================================================
export const searchProducts = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = DEFAULT_PAGE_SIZE } = req.query

  if (!q?.trim()) {
    return res.json({ success: true, products: [], total: 0, page: 1, totalPages: 0 })
  }

  const query = {
    isActive: true,
    $text: { $search: q },
  }

  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(parseInt(limit, 10), 48)
  const skip = (pageNum - 1) * limitNum

  const [products, total] = await Promise.all([
    Product.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug')
      .lean(),
    Product.countDocuments(query),
  ])

  res.json({
    success: true,
    products,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    query: q,
  })
})

// ============================================================
// POST /api/products
// ============================================================
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    price,
    compareAtPrice,
    category,
    images,
    sku,
    stock,
    featured,
    newArrival,
  } = req.body

  // Basic slug generation
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

  const product = await Product.create({
    name,
    slug,
    description,
    shortDescription,
    price,
    compareAtPrice,
    category,
    images,
    sku,
    stock,
    featured,
    newArrival,
  })

  res.status(201).json({ success: true, product })
})
