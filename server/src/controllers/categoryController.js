import Category from '../models/Category.js'
import { asyncHandler, AppError } from '../middleware/errorHandler.js'

// ============================================================
// GET /api/categories
// ============================================================
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 })
  res.json({ success: true, categories })
})

// ============================================================
// POST /api/categories
// ============================================================
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, image, parent, displayOrder, isActive, seoTitle, seoDescription } = req.body

  if (!name || !slug) {
    throw new AppError('Name and slug are required', 400)
  }

  const categoryExists = await Category.findOne({ slug })
  if (categoryExists) {
    throw new AppError('Category with this slug already exists', 400)
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
    parent: parent || null,
    displayOrder,
    isActive,
    seoTitle,
    seoDescription
  })

  res.status(201).json({ success: true, category })
})

// ============================================================
// PUT /api/categories/:id
// ============================================================
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, slug, description, image, parent, displayOrder, isActive, seoTitle, seoDescription } = req.body

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError('Category not found', 404)
  }

  if (slug && slug !== category.slug) {
    const slugExists = await Category.findOne({ slug })
    if (slugExists) throw new AppError('Category with this slug already exists', 400)
  }

  category.name = name || category.name
  if (slug) category.slug = slug
  if (description !== undefined) category.description = description
  if (image !== undefined) category.image = image
  if (parent !== undefined) category.parent = parent || null
  if (displayOrder !== undefined) category.displayOrder = displayOrder
  if (isActive !== undefined) category.isActive = isActive
  if (seoTitle !== undefined) category.seoTitle = seoTitle
  if (seoDescription !== undefined) category.seoDescription = seoDescription

  await category.save()

  res.json({ success: true, category })
})

// ============================================================
// DELETE /api/categories/:id
// ============================================================
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError('Category not found', 404)
  }

  await category.deleteOne()

  res.json({ success: true, message: 'Category deleted successfully' })
})
