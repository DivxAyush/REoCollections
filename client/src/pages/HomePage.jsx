import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHomepageData } from '@/redux/slices/homepageSlice'
import Container from '@/components/ui/Container'
import { PageLoader } from '@/components/ui/Loader'
import HeroBanner from '@/components/banner/HeroBanner'
import OfferBanner from '@/components/banner/OfferBanner'
import ProductGrid from '@/components/product/ProductGrid'
import SectionHeading from '@/components/ui/SectionHeading'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const dispatch = useDispatch()
  const { banners, featuredProducts, categories, isLoading } = useSelector((state) => state.homepage)

  useEffect(() => {
    document.title = 'REo Collection — Premium Indian Fashion'
    dispatch(fetchHomepageData())
  }, [dispatch])

  if (isLoading) return <PageLoader />

  const heroBanner = banners?.find(b => b.type === 'hero')
  const offerBanners = banners?.filter(b => b.type === 'promotional') || []


  return (
    <div className="pb-16 flex flex-col gap-16 lg:gap-24">
      {/* 1. Hero Section */}
      <section>
        {heroBanner ? (
          <HeroBanner banner={heroBanner} />
        ) : (
          <div className="h-[60vh] w-full bg-[#111111] flex items-center justify-center">
            <h1 className="text-4xl text-white font-bold">REo Collection</h1>
          </div>
        )}
      </section>

      {/* 2. Shop by Category */}
      {categories.length > 0 && (
        <section>
          <Container>
            <SectionHeading title="Shop by Category" className="mb-8" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/shop/${category.slug}`}
                  className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-xl bg-[#F7F7F6]"
                >
                  {category.image?.url && (
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative mt-auto p-4 sm:p-6 text-center w-full">
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 3. Promotional Banner */}
      {offerBanners.length > 0 && (
        <section>
          <Container>
            <OfferBanner banner={offerBanners[0]} />
          </Container>
        </section>
      )}

      {/* 4. Featured Products */}
      {featuredProducts.length > 0 && (
        <section>
          <Container>
            <SectionHeading
              title="Featured Collection"
              subtitle="Handpicked premium styles for you."
              className="mb-8"
              action={
                <Link to="/shop">
                  <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All
                  </Button>
                </Link>
              }
            />
            <ProductGrid products={featuredProducts} columns="four" />
          </Container>
        </section>
      )}

      {/* 5. Values Section */}
      <section className="bg-[#F7F7F6] py-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:gap-12">
            <div>
              <h4 className="text-base font-bold text-[#111111]">Premium Quality</h4>
              <p className="mt-2 text-sm text-[#5F5F5F]">Carefully selected fabrics and expert craftsmanship in every piece.</p>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#111111]">Sustainable Fashion</h4>
              <p className="mt-2 text-sm text-[#5F5F5F]">Ethically sourced materials designed to last longer.</p>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#111111]">Easy Returns</h4>
              <p className="mt-2 text-sm text-[#5F5F5F]">30-day hassle-free return policy on all unworn items.</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
