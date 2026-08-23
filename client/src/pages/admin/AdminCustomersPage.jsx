import { Users } from 'lucide-react'

export default function AdminCustomersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="text-blue-600" />
          Customers
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your store's registered customers (Coming Soon).</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Customers module is under construction</h2>
        <p className="text-slate-500 mt-2">
          This page will show a list of all your customers, their order history, and account status.
        </p>
      </div>
    </div>
  )
}
