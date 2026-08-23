import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, Lock } from 'lucide-react'
import { useEffect as useEffectAfter } from 'react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const { login, isLoading, error, isAuthenticated, dismissError, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from || ROUTES.ACCOUNT

  useEffect(() => {
    document.title = 'Sign In — REo Collection'
    return () => dismissError()
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      if (['admin', 'super_admin', 'helper'].includes(user.role)) {
        logout()
        navigate('/admin', { replace: true, state: { error: 'Please login through the admin portal.' } })
      } else {
        navigate(returnTo, { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate, returnTo, logout])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data) => login(data)

  return (
    <div className="rounded-xl border border-[#E5E5E3] bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#111111]">Welcome back</h1>
        <p className="mt-1 text-sm text-[#5F5F5F]">Sign in to your REo Collection account</p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          prefixIcon={Mail}
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          prefixIcon={Lock}
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-[#C9AD8B] hover:text-[#A98C6C] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5F5F5F]">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-[#111111] hover:text-[#C9AD8B] transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  )
}
