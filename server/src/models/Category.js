import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: '' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // Admin-ready fields
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
)

categorySchema.index({ slug: 1 })
categorySchema.index({ isActive: 1, displayOrder: 1 })
categorySchema.index({ parent: 1 })

const Category = mongoose.model('Category', categorySchema)
export default Category
