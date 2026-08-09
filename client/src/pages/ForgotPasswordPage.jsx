import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Mail, ArrowLeft } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Forgot Password — REo Collection'
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.forgotPassword(email)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-[#E5E5E3] bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F6]">
          <Mail className="h-6 w-6 text-[#C9AD8B]" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-[#111111]">Check your email</h1>
        <p className="mt-2 text-sm text-[#5F5F5F]">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Link to={ROUTES.LOGIN} className="mt-6 inline-flex items-center gap-1 text-sm text-[#C9AD8B] hover:text-[#A98C6C]">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#E5E5E3] bg-white p-8 shadow-sm">
      <Link to={ROUTES.LOGIN} className="mb-6 inline-flex items-center gap-1 text-sm text-[#5F5F5F] hover:text-[#111111]">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to sign in
      </Link>

      <h1 className="text-2xl font-bold text-[#111111]">Forgot password?</h1>
      <p className="mt-1 text-sm text-[#5F5F5F]">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div role="alert" className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
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
        <Button type="submit" fullWidth isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>
    </div>
  )
}
