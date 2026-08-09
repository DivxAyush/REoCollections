import { useEffect } from 'react'
import Container from '@/components/ui/Container'

export default function AccountPage() {
  useEffect(() => { document.title = 'My Account — REo Collection' }, [])
  return <Container className="py-8"><p className="text-sm text-[#5F5F5F]">Redirecting to profile…</p></Container>
}
