import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { ShieldAlert, KeyRound, Mail, Loader2, Server } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
})

export default function AdminLoginPage() {
  const { login, error, dismissError, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const returnTo = location.state?.from || '/admin-ayush2133k'
  const stateError = location.state?.error

  useEffect(() => {
    document.title = 'SECURE LOGIN | Admin Portal'
    return () => dismissError()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      if (['admin', 'super_admin', 'helper'].includes(user?.role)) {
        navigate(returnTo, { replace: true })
      } else {
        // If normal customer logs in here somehow, boot them
        navigate('/')
      }
    }
  }, [isAuthenticated, user, navigate, returnTo])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    await login(data)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      {/* Industrial Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 opacity-80" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-slate-900/20 skew-x-12 -translate-x-32" />
      <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none">
         <Server size={300} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#121212] border border-slate-800 p-8 shadow-2xl relative">
          
          {/* Top corner screws/accents */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-700 shadow-inner" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-700 shadow-inner" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-700 shadow-inner" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-700 shadow-inner" />

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-red-950/30 border border-red-900/50 rounded flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
              <ShieldAlert className="text-red-500" size={28} />
            </div>
            <h1 className="text-xl tracking-[0.2em] font-bold text-white uppercase text-center">
              Restricted Area
            </h1>
            <p className="text-xs text-slate-500 mt-2 tracking-widest uppercase">
              Authorized Personnel Only
            </p>
          </div>

          {(error || stateError) && (
            <div className="mb-6 bg-red-950/20 border-l-2 border-red-500 p-3 flex items-start gap-3">
              <span className="text-red-500 mt-0.5 animate-pulse">!</span>
              <p className="text-xs text-red-400 font-medium">{error || stateError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold" htmlFor="email">
                Access ID (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@system.local"
                  className="w-full bg-[#0A0A0A] border border-slate-800 text-slate-300 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-colors placeholder:text-slate-700 rounded-none"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold" htmlFor="password">
                Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-600" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-slate-800 text-slate-300 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-colors placeholder:text-slate-700 rounded-none"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-red-900/80 hover:bg-red-800 text-white font-semibold text-xs tracking-widest uppercase py-3.5 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed border border-red-700"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  INITIALIZE LOGIN
                </span>
              )}
              {/* Scanline effect on hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-white/20 translate-y-[-100%] group-hover:animate-[scan_1.5s_ease-in-out_infinite]" />
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-slate-800/50 text-center">
            <p className="text-[9px] text-slate-600 uppercase tracking-widest">
              System v2.4.1 // SECURE CONNECTION
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(50px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
