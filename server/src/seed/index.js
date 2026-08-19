import 'dotenv/config'
import mongoose from 'mongoose'
import env from '../config/env.js'

// Models
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Banner from '../models/Banner.js'
import Collection from '../models/Collection.js'
import HomepageSection from '../models/HomepageSection.js'

const sampleImage = {
  url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
  publicId: 'sample'
}

async function seed() {
  try {
    console.log('Connecting to database...')
    await mongoose.connect(env.mongoUri, { dbName: 'reo-collection' })
    console.log('Connected.')

    console.log('Clearing old data...')
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Banner.deleteMany({}),
      Collection.deleteMany({}),
      HomepageSection.deleteMany({}),
    ])

    // ==========================================
    // 1. Categories
    // ==========================================
    console.log('Seeding Categories...')
    const [men, footwear] = await Category.insertMany([
      { name: 'Men', slug: 'men', displayOrder: 1 },
      { name: 'Footwear', slug: 'footwear', displayOrder: 2 },
    ])

    // ==========================================
    // 2. Collections
    // ==========================================
    console.log('Seeding Collections...')
    const [summer, festive, basics] = await Collection.insertMany([
      { name: 'Summer Breeze', slug: 'summer-breeze', image: sampleImage },
      { name: 'Festive Wear', slug: 'festive-wear', image: sampleImage },
      { name: 'Everyday Basics', slug: 'everyday-basics', image: sampleImage },
    ])

    // ==========================================
    // 3. Products
    // ==========================================
    console.log('Seeding Products...')
    const productsData = [
      {
        name: 'Classic White Shirt',
        slug: 'classic-white-shirt',
        category: men._id,
        price: 1299,
        compareAtPrice: 1999,
        discount: Math.round(((1999 - 1299) / 1999) * 100),
        images: [sampleImage],
        colors: ['White'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 50,
        featured: true,
        bestSeller: true,
        rating: 4.8,
        reviewCount: 124,
      },
      {
        name: 'Premium Leather Loafers',
        slug: 'premium-leather-loafers',
        category: footwear._id,
        price: 3499,
        images: [sampleImage],
        colors: ['Brown', 'Black'],
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        stock: 20,
        featured: true,
      }
    ]

    const products = await Product.insertMany(productsData)

    // ==========================================
    // 4. Banners
    // ==========================================
    console.log('Seeding Banners...')
    const [heroBanner, promotionalBanner] = await Banner.insertMany([
      {
        type: 'hero',
        title: 'Summer Collection 2026',
        subtitle: 'Breezy styles for sunny days',
        buttonText: 'Shop Now',
        redirectUrl: '/shop/men',
        desktopImage: sampleImage,
        displayOrder: 1,
      },
      {
        type: 'promotional',
        title: 'Flat 50% Off',
        subtitle: 'On selected styles',
        buttonText: 'View Offers',
        redirectUrl: '/shop/offers',
        desktopImage: sampleImage,
        displayOrder: 2,
      },
    ])

    // ==========================================
    // 5. Homepage Sections
    // ==========================================
    console.log('Seeding Homepage Sections...')
    await HomepageSection.insertMany([
      {
        sectionType: 'hero',
        sectionName: 'Hero Slider',
        displayOrder: 1,
        bannerIds: [heroBanner._id],
      },
      {
        sectionType: 'category-grid',
        sectionName: 'Shop by Category',
        displayOrder: 2,
        categoryIds: [men._id, footwear._id],
      },
      {
        sectionType: 'product-carousel',
        sectionName: 'Featured Products',
        subtitle: 'Handpicked for you',
        displayOrder: 3,
        productIds: products.map(p => p._id),
      },
      {
        sectionType: 'banner',
        sectionName: 'Mid-page Promo',
        displayOrder: 4,
        bannerIds: [promotionalBanner._id],
      },
      {
        sectionType: 'collection-grid',
        sectionName: 'Curated Collections',
        displayOrder: 5,
        collectionIds: [summer._id, festive._id, basics._id],
      },
    ])

    console.log('✅ Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
