import mongoose from 'mongoose'

// ============================================================
// VARIANT SUB-SCHEMA
// ============================================================
const variantSchema = new mongoose.Schema(
  {
    color: { type: String, default: '' },
    size: { type: String, default: '' },
    sku: { type: String, default: '' },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
  },
  { _id: true }
)

// ============================================================
// IMAGE SUB-SCHEMA
// ============================================================
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    secureUrl: { type: String, default: '' },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
)

// ============================================================
// PRODUCT SCHEMA
// ============================================================
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    brand: { type: String, default: 'REo Collection', trim: true },

    // Category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    subCategory: { type: String, default: '' },
    tags: [{ type: String, lowercase: true, trim: true }],

    // Images — all stored on Cloudinary
    images: [imageSchema],

    // Pricing
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: { type: Number, default: null },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // Percentage

    // Inventory
    sku: { type: String, default: '', index: true },
    stock: { type: Number, default: 0, min: 0 },

    // Variants (color × size combinations)
    variants: [variantSchema],

    // Available options (derived from variants for quick filtering)
    colors: [{ type: String }],
    sizes: [{ type: String }],

    // Ratings (updated by review aggregation)
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // Merchandising flags
    featured: { type: Boolean, default: false, index: true },
    newArrival: { type: Boolean, default: false, index: true },
    bestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },

    // Admin-ready
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    material: { type: String, default: '' },
    washCare: { type: String, default: '' },
    weight: { type: Number, default: 0 }, // grams

    // Sorting weight
    sortWeight: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

// ============================================================
// INDEXES
// ============================================================

productSchema.index({ category: 1, isActive: 1 })
productSchema.index({ featured: 1, isActive: 1 })
productSchema.index({ newArrival: 1, isActive: 1 })
productSchema.index({ bestSeller: 1, isActive: 1 })
productSchema.index({ tags: 1 })
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ createdAt: -1 })

const Product = mongoose.model('Product', productSchema)
export default Product
