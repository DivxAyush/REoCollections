import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    redirectUrl: { type: String, default: '/shop' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // Product references (optional — can also filter by tags/category)
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // Admin-ready
    filterQuery: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

collectionSchema.index({ slug: 1 })
collectionSchema.index({ isActive: 1, displayOrder: 1 })

const Collection = mongoose.model('Collection', collectionSchema)
export default Collection
