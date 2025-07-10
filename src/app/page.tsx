'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Heart, TrendingUp, Clock, Shield } from 'lucide-react'

function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-4xl font-bold text-primary-800">OhMyGerd</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-background opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-primary-800 mb-4">
              OhMyGerd
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              The only 2-minute daily GERD tracker that connects your symptoms to real relief - 
              designed specifically for natural healing solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="animate-scale-in">
                  Start Tracking Today
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card hover className="animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary-700" />
                </div>
                <CardTitle className="text-lg">2-Minute Daily Check</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Quick daily tracking that fits into your routine. No complicated forms or lengthy surveys.
                </CardDescription>
              </CardContent>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Symptom Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track discomfort, heartburn, and sleep patterns to identify your personal triggers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-peach-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-peach-600" />
                </div>
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualize your journey with beautiful charts and celebrate your improvements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card hover className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-clay-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-clay-600" />
                </div>
                <CardTitle className="text-lg">Natural Relief</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamlessly integrated with Liao Reflux Relief for holistic GERD management.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-20 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Take Control?</CardTitle>
                <CardDescription className="text-lg">
                  Join thousands who've transformed their GERD journey with intelligent tracking and natural relief.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <p className="text-sm text-text-muted mt-4">
                  No credit card required • 2-minute setup • Instant insights
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(HomePage), { ssr: false })
