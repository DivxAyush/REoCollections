import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/redux/slices/productSlice'
import Container from '@/components/ui/Container'
import ProductGrid from '@/components/product/ProductGrid'
import ProductGridSkeleton from '@/components/product/ProductGridSkeleton'
import SectionHeading from '@/components/ui/SectionHeading'

export default function ShopPage() {
  const { category } = useParams()
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector((state) => state.product)

  useEffect(() => {
    document.title = 'Shop — REo Collection'
    dispatch(fetchProducts({ page: 1, limit: 12, category: category || '' }))
  }, [dispatch, category])

  return (
    <div className="bg-[#F7F7F6] py-10 min-h-screen">
      <Container>
        <SectionHeading title="All Products" subtitle="Discover our premium collection." className="mb-8" />
        
        {isLoading ? (
          <ProductGridSkeleton count={8} columns="four" />
        ) : (
          <ProductGrid products={products} columns="four" />
        )}
      </Container>
    </div>
  )
}
