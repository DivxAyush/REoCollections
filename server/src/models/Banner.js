import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['hero', 'offer', 'promotional', 'collection'],
      required: true,
    },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    desktopImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    mobileImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    buttonText: { type: String, default: '' },
    redirectUrl: { type: String, default: '/' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    // Admin-ready metadata
    name: { type: String, default: '' }, // Internal name for admin
    tags: [{ type: String }],
  },
  { timestamps: true }
)

bannerSchema.index({ isActive: 1, displayOrder: 1 })
bannerSchema.index({ type: 1, isActive: 1 })
bannerSchema.index({ startDate: 1, endDate: 1 })

const Banner = mongoose.model('Banner', bannerSchema)
export default Banner
