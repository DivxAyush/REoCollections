import Banner from '../models/Banner.js'
import { asyncHandler } from '../middleware/errorHandler.js'

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    subtitle,
    desktopImage,
    mobileImage,
    buttonText,
    redirectUrl,
    displayOrder,
    isActive,
    startDate,
    endDate,
    name,
    tags,
  } = req.body

  const banner = await Banner.create({
    type,
    title,
    subtitle,
    desktopImage,
    mobileImage,
    buttonText,
    redirectUrl,
    displayOrder,
    isActive,
    startDate,
    endDate,
    name,
    tags,
  })

  res.status(201).json({
    success: true,
    banner,
  })
})

// @desc    Get all banners (Admin)
// @route   GET /api/banners
// @access  Private/Admin
export const getAdminBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort({ createdAt: -1 })
  
  res.json({
    success: true,
    banners,
  })
})

// @desc    Get banner by ID
// @route   GET /api/banners/:id
// @access  Private/Admin
export const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)

  if (banner) {
    res.json({
      success: true,
      banner,
    })
  } else {
    res.status(404)
    throw new Error('Banner not found')
  }
})

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    subtitle,
    desktopImage,
    mobileImage,
    buttonText,
    redirectUrl,
    displayOrder,
    isActive,
    startDate,
    endDate,
    name,
    tags,
  } = req.body

  const banner = await Banner.findById(req.params.id)

  if (banner) {
    banner.type = type || banner.type
    banner.title = title !== undefined ? title : banner.title
    banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle
    banner.desktopImage = desktopImage || banner.desktopImage
    banner.mobileImage = mobileImage || banner.mobileImage
    banner.buttonText = buttonText !== undefined ? buttonText : banner.buttonText
    banner.redirectUrl = redirectUrl !== undefined ? redirectUrl : banner.redirectUrl
    banner.displayOrder = displayOrder !== undefined ? displayOrder : banner.displayOrder
    banner.isActive = isActive !== undefined ? isActive : banner.isActive
    banner.startDate = startDate !== undefined ? startDate : banner.startDate
    banner.endDate = endDate !== undefined ? endDate : banner.endDate
    banner.name = name !== undefined ? name : banner.name
    banner.tags = tags || banner.tags

    const updatedBanner = await banner.save()

    res.json({
      success: true,
      banner: updatedBanner,
    })
  } else {
    res.status(404)
    throw new Error('Banner not found')
  }
})

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id)

  if (banner) {
    await banner.deleteOne()
    res.json({ success: true, message: 'Banner removed' })
  } else {
    res.status(404)
    throw new Error('Banner not found')
  }
})
