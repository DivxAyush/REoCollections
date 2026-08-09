import { useEffect } from 'react'
import EmptyState from '@/components/ui/EmptyState'
import { MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AddressesPage() {
  useEffect(() => { document.title = 'Addresses — REo Collection' }, [])
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#111111]">Saved Addresses</h2>
      <div className="mt-6">
        <EmptyState icon={MapPin} title="No addresses saved" description="Add a delivery address to speed up checkout." action={<Button>Add Address</Button>} />
      </div>
    </div>
  )
}
