import mongoose from 'mongoose'

const homepageSectionSchema = new mongoose.Schema(
  {
    sectionType: {
      type: String,
      enum: [
        'hero',
        'banner',
        'offer',
        'collection-grid',
        'category-grid',
        'product-carousel',
        'product-grid',
        'promotional',
        'newsletter',
      ],
      required: true,
    },
    sectionName: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // Section-specific configuration (flexible)
    config: { type: mongoose.Schema.Types.Mixed, default: {} },

    // References to items in this section
    // (depends on sectionType — could be banners, products, collections, etc.)
    bannerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Banner' }],
    collectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // Or a dynamic filter to auto-select products
    productFilter: { type: mongoose.Schema.Types.Mixed, default: null },
    productLimit: { type: Number, default: 8 },
  },
  { timestamps: true }
)

homepageSectionSchema.index({ isActive: 1, displayOrder: 1 })

const HomepageSection = mongoose.model('HomepageSection', homepageSectionSchema)
export default HomepageSection
