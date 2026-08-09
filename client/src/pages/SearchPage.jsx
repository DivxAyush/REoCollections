import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Container from '@/components/ui/Container'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  useEffect(() => {
    document.title = query ? `"${query}" — Search — REo Collection` : 'Search — REo Collection'
  }, [query])

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold text-[#111111]">Search Results</h1>
      {query && <p className="mt-2 text-sm text-[#5F5F5F]">Searching for: &ldquo;{query}&rdquo; — Full search coming in Phase 3.</p>}
    </Container>
  )
}
