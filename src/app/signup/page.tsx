'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [acceptedPolicies, setAcceptedPolicies] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: '',
        last_name: '',
        age: 0,
        gender: '',
        gerd_duration: '',
        worst_symptoms: [],
        liao_customer_status: '',
        known_triggers: []
      })
      
      if (error) {
        setError(error.message)
        return
      }

      router.push('/survey')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.email && formData.password && formData.confirmPassword && acceptedPolicies

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/liao-symbol.png" alt="Liao Herbal" className="h-8 mr-3" />
            <h1 className="text-4xl font-bold text-primary-800">
              OhMyGerd
            </h1>
          </div>
          <p className="text-text-secondary">
            Start your GERD tracking journey today
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center font-sans font-bold">Create Account</CardTitle>
            <CardDescription>
              Sign up to begin tracking your GERD symptoms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
                placeholder="Enter your email"
                required
              />
              
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                placeholder="Create a strong password"
                helperText="Must be at least 8 characters long"
                required
              />
              
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                placeholder="Confirm your password"
                required
              />
              
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accept-policies"
                  checked={acceptedPolicies}
                  onCheckedChange={(checked) => setAcceptedPolicies(!!checked)}
                  className="mt-1"
                />
                <label htmlFor="accept-policies" className="text-sm text-text-secondary leading-relaxed">
                  I accept the{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-accent hover:text-accent-dark transition-colors underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/data-policy"
                    className="text-accent hover:text-accent-dark transition-colors underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Data Policy
                  </Link>
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full font-sans text-white"
                style={{ backgroundColor: '#df6552' }}
                loading={loading}
                disabled={!isFormValid}
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-accent hover:text-accent-dark transition-colors font-bold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
          <p className="text-sm text-text-muted">
            © 2025 by LiaoHerbal LLC
          </p>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(SignupPage), { ssr: false })