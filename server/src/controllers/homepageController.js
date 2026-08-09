import Banner from '../models/Banner.js'
import Category from '../models/Category.js'
import Collection from '../models/Collection.js'
import Product from '../models/Product.js'
import HomepageSection from '../models/HomepageSection.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// ============================================================
// GET /api/homepage
// Single optimized endpoint for all homepage data
// ============================================================
export const getHomepageData = asyncHandler(async (req, res) => {
  const now = new Date()

  // Fetch all data in parallel for performance
  const [banners, sections, featuredProducts, categories, collections] =
    await Promise.all([
      // Active banners within date range
      Banner.find({
        isActive: true,
        $or: [
          { startDate: null },
          { startDate: { $lte: now } },
        ],
        $or: [
          { endDate: null },
          { endDate: { $gte: now } },
        ],
      })
        .sort({ displayOrder: 1 })
        .lean(),

      // Homepage sections (ordered)
      HomepageSection.find({ isActive: true })
        .sort({ displayOrder: 1 })
        .populate('collectionIds')
        .populate({ path: 'productIds', match: { isActive: true }, select: 'name slug price compareAtPrice images rating reviewCount newArrival bestSeller discount colors' })
        .populate('categoryIds', 'name slug image')
        .populate('bannerIds')
        .lean(),

      // Featured products
      Product.find({ isActive: true, featured: true })
        .sort({ sortWeight: -1 })
        .limit(8)
        .select('name slug price compareAtPrice images rating reviewCount newArrival bestSeller discount colors sizes')
        .lean(),

      // Active categories
      Category.find({ isActive: true, parent: null })
        .sort({ displayOrder: 1 })
        .limit(12)
        .select('name slug image')
        .lean(),

      // Active collections
      Collection.find({ isActive: true })
        .sort({ displayOrder: 1 })
        .limit(8)
        .select('name slug image redirectUrl description')
        .lean(),
    ])

  res.json({
    success: true,
    banners,
    sections,
    featuredProducts,
    categories,
    collections,
  })
})
