// Temporary dummy data to test the UI without backend

export const sampleImage = {
  url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
  publicId: 'sample'
}

export const mockUser = {
  _id: 'user123',
  name: 'Ayush (Guest)',
  email: 'ayush@example.com',
  role: 'customer',
  addresses: []
}

export const mockProducts = [
  {
    _id: 'p1',
    name: 'Classic White Shirt',
    slug: 'classic-white-shirt',
    category: { name: 'Men', slug: 'men' },
    price: 1299,
    compareAtPrice: 1999,
    discount: 35,
    images: [sampleImage],
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
    featured: true,
    bestSeller: true,
    rating: 4.8,
    reviewCount: 124,
    isActive: true,
  },
  {
    _id: 'p2',
    name: 'Floral Summer Maxi',
    slug: 'floral-summer-maxi',
    category: { name: 'Women', slug: 'women' },
    price: 2499,
    compareAtPrice: 3299,
    discount: 24,
    images: [{ url: 'https://images.unsplash.com/photo-1572804013309-82a89b47af72?q=80&w=1000&auto=format&fit=crop' }],
    colors: ['Blue', 'Pink'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 30,
    featured: true,
    newArrival: true,
    rating: 4.5,
    reviewCount: 45,
    isActive: true,
  },
  {
    _id: 'p3',
    name: 'Kids Graphic Tee',
    slug: 'kids-graphic-tee',
    category: { name: 'Kids', slug: 'kids' },
    price: 599,
    compareAtPrice: 899,
    discount: 33,
    images: [{ url: 'https://images.unsplash.com/photo-1519238384214-6019313ea595?q=80&w=1000&auto=format&fit=crop' }],
    colors: ['Yellow', 'Red'],
    sizes: ['2-3Y', '3-4Y', '5-6Y'],
    stock: 100,
    bestSeller: true,
    rating: 4.2,
    reviewCount: 89,
    isActive: true,
  },
  {
    _id: 'p4',
    name: 'Premium Leather Loafers',
    slug: 'premium-leather-loafers',
    category: { name: 'Footwear', slug: 'footwear' },
    price: 3499,
    compareAtPrice: 4999,
    discount: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1499013819532-e4ff41b00669?q=80&w=1000&auto=format&fit=crop' }],
    colors: ['Brown', 'Black'],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    stock: 20,
    featured: true,
    isActive: true,
  }
]

export const mockHomepageData = {
  banners: [
    {
      _id: 'b1',
      type: 'hero',
      title: 'Summer Collection 2026',
      subtitle: 'Breezy styles for sunny days',
      buttonText: 'Shop Now',
      redirectUrl: '/shop/women',
      desktopImage: { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1920&auto=format&fit=crop' },
      displayOrder: 1,
    }
  ],
  sections: [],
  featuredProducts: mockProducts.slice(0, 4),
  categories: [
    { _id: 'c1', name: 'Women', slug: 'women', image: { url: 'https://images.unsplash.com/photo-1534653299134-96a171b61581?q=80&w=500&auto=format&fit=crop' } },
    { _id: 'c2', name: 'Men', slug: 'men', image: { url: 'https://images.unsplash.com/photo-1507680434267-325d222238cd?q=80&w=500&auto=format&fit=crop' } },
    { _id: 'c3', name: 'Kids', slug: 'kids', image: { url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=500&auto=format&fit=crop' } },
    { _id: 'c4', name: 'Footwear', slug: 'footwear', image: { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop' } },
  ],
  collections: [
    { _id: 'col1', name: 'Summer Breeze', slug: 'summer-breeze', image: { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=500&auto=format&fit=crop' }, redirectUrl: '/shop' },
    { _id: 'col2', name: 'Festive Wear', slug: 'festive-wear', image: { url: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=500&auto=format&fit=crop' }, redirectUrl: '/shop' },
    { _id: 'col3', name: 'Everyday Basics', slug: 'everyday-basics', image: { url: 'https://images.unsplash.com/photo-1558769132-cb1fac0840ff?q=80&w=500&auto=format&fit=crop' }, redirectUrl: '/shop' },
  ]
}

export const mockCart = {
  items: [],
  total: 0
}

export const mockWishlist = {
  products: []
}

// Mock Interceptor
export const setupMockInterceptor = (apiClient) => {
  apiClient.interceptors.request.use(config => {
    // Return a promise that rejects with a custom object we can catch in the response interceptor
    return Promise.reject({ config, isMock: true })
  })

  apiClient.interceptors.response.use(
    res => res,
    async (error) => {
      if (!error.isMock) return Promise.reject(error)

      const url = error.config.url
      const method = error.config.method.toLowerCase()
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500))

      const data = (() => {
        // AUTH
        if (url.includes('/auth/me')) return { success: true, user: mockUser }
        if (url.includes('/auth/login') || url.includes('/auth/register')) 
          return { success: true, user: mockUser, token: 'fake-jwt-token' }
        if (url.includes('/auth/logout')) return { success: true }
        
        // HOMEPAGE
        if (url.includes('/homepage')) return { success: true, ...mockHomepageData }
        
        // PRODUCTS
        if (url.includes('/products/featured') || url.includes('/products/new-arrivals') || url.includes('/products/best-sellers')) 
          return { success: true, products: mockProducts }
        if (url.includes('/products/') && method === 'get' && !url.endsWith('/products')) 
          return { success: true, product: mockProducts[0] }
        if (url.includes('/products')) 
          return { success: true, products: mockProducts, total: 4, page: 1, totalPages: 1, limit: 12 }
        
        // CART
        if (url.includes('/cart')) {
          if (method === 'get') return { success: true, cart: mockCart }
          if (method === 'post') {
            const body = JSON.parse(error.config.data)
            const prod = mockProducts.find(p => p._id === body.productId)
            if (prod) {
              const existing = mockCart.items.find(i => i.product._id === prod._id)
              if (existing) existing.quantity += body.quantity
              else mockCart.items.push({ product: prod, quantity: body.quantity })
              mockCart.total = mockCart.items.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0)
            }
            return { success: true, cart: mockCart }
          }
        }
        
        // WISHLIST
        if (url.includes('/wishlist')) {
          if (method === 'get') return { success: true, wishlist: mockWishlist }
          if (url.includes('/toggle')) {
            const body = JSON.parse(error.config.data)
            const exists = mockWishlist.products.find(p => p._id === body.productId)
            if (exists) {
              mockWishlist.products = mockWishlist.products.filter(p => p._id !== body.productId)
            } else {
              const p = mockProducts.find(p => p._id === body.productId)
              if (p) mockWishlist.products.push(p)
            }
            return { success: true, wishlist: mockWishlist, added: !exists }
          }
        }

        // DEFAULT FALLBACK
        return { success: true }
      })()

      return data
    }
  )
}
