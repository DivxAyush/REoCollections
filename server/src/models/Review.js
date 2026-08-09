import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: { type: String, default: '', maxlength: 100 },
    body: { type: String, default: '', maxlength: 2000 },
    verifiedPurchase: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    helpful: { type: Number, default: 0 },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
  },
  { timestamps: true }
)

// One review per product per user
reviewSchema.index({ product: 1, user: 1 }, { unique: true })
reviewSchema.index({ product: 1, isActive: 1, createdAt: -1 })

// After save, update product's average rating
reviewSchema.post('save', async function () {
  try {
    const Product = mongoose.model('Product')
    const stats = await mongoose.model('Review').aggregate([
      { $match: { product: this.product, isActive: true } },
      {
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ])

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(this.product, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count,
      })
    }
  } catch {
    // Non-critical — don't crash on rating update failure
  }
})

const Review = mongoose.model('Review', reviewSchema)
export default Review
