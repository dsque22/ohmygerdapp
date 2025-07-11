'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, ExternalLink } from 'lucide-react'

function ShopPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-2xl font-bold text-primary-800">Loading...</div>
        </div>
      </div>
    )
  }

  const handlePurchase = () => {
    window.open('https://www.liaoherbal.com/refluxrelief', '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          {/* Product Image */}
          <div className="w-full max-w-md">
            <img 
              src="/liao-product.png" 
              alt="Liao Reflux Relief Product" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Discount Code */}
          <div className="bg-accent-50 border border-accent rounded-lg p-6 max-w-md w-full">
            <p className="text-accent font-semibold text-lg mb-2">
              Exclusive Discount Code
            </p>
            <p className="text-2xl font-bold text-primary-800 mb-2">
              OHMYGERD10
            </p>
            <p className="text-text-secondary text-sm">
              Use code for additional 10% off
            </p>
          </div>

          {/* Buy Button */}
          <Button
            onClick={handlePurchase}
            size="lg"
            className="font-sans text-white px-8 py-4 text-xl"
            style={{ backgroundColor: '#df6552' }}
          >
            GET LIAO NOW
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ShopPage), { ssr: false })