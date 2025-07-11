'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  // Only show loading during auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-2xl font-bold text-primary-800">Loading...</div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(email, password)
      console.log('SignIn result:', result)
      
      if (result.error) {
        setError(typeof result.error === 'string' ? result.error : result.error?.message || 'Login failed')
        setLoading(false)
        return
      }

      // Successfully signed in, don't set loading to false - let redirect happen
      console.log('Login successful, redirecting to dashboard')
      router.push('/dashboard')
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

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
            Welcome back to your GERD tracking journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center font-sans font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
                placeholder="Enter your email"
                required
              />
              
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Enter your password"
                required
              />
              
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full font-sans text-white"
                style={{ backgroundColor: '#df6552' }}
                loading={loading}
                disabled={!email || !password}
              >
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-accent hover:text-accent-dark transition-colors"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-accent hover:text-accent-dark transition-colors font-bold"
                >
                  Sign up
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

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false })