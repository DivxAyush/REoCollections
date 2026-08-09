import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, Lock, User } from 'lucide-react'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function RegisterPage() {
  const { register: registerUser, isLoading, error, isAuthenticated, dismissError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Create Account — REo Collection'
    return () => dismissError()
  }, [])

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.ACCOUNT, { replace: true })
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = (data) => {
    const { confirmPassword, ...userData } = data
    registerUser(userData)
  }

  return (
    <div className="rounded-xl border border-[#E5E5E3] bg-white p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#111111]">Create an account</h1>
        <p className="mt-1 text-sm text-[#5F5F5F]">Join REo Collection for exclusive offers</p>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="name"
          label="Full name"
          type="text"
          placeholder="Your full name"
          prefixIcon={User}
          required
          error={errors.name?.message}
          {...register('name')}
        />
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
          placeholder="Create a password"
          prefixIcon={Lock}
          required
          error={errors.password?.message}
          helperText="At least 6 characters"
          {...register('password')}
        />
        <Input
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          prefixIcon={Lock}
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5F5F5F]">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-[#111111] hover:text-[#C9AD8B] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
