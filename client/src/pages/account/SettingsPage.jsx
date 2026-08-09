import { useEffect } from 'react'

export default function SettingsPage() {
  useEffect(() => { document.title = 'Settings — REo Collection' }, [])
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#111111]">Account Settings</h2>
      <p className="mt-2 text-sm text-[#5F5F5F]">Settings coming in Phase 5.</p>
    </div>
  )
}
