'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ShoppingBag, 
  Star, 
  Check, 
  ExternalLink, 
  Heart,
  Leaf,
  Shield,
  Award,
  ArrowLeft
} from 'lucide-react'

const PRODUCT_INFO = {
  name: 'Liao Reflux Relief',
  price: 89,
  originalPrice: 99,
  rating: 4.8,
  reviewCount: 247,
  image: '/liao-product.jpg',
  features: [
    'Natural herbal formula based on Traditional Chinese Medicine',
    'Clinically tested for GERD symptom relief',
    'No artificial additives or preservatives',
    'Suitable for long-term daily use',
    '30-day money-back guarantee',
    'Free shipping on orders over $75'
  ],
  benefits: [
    'Reduces heartburn and acid reflux symptoms',
    'Improves digestive health naturally',
    'Supports better sleep quality',
    'Helps maintain healthy stomach acid levels',
    'Promotes overall digestive wellness'
  ],
  ingredients: [
    'Ginger Root Extract (250mg)',
    'Licorice Root (200mg)',
    'Fennel Seed (150mg)',
    'Chamomile Flower (100mg)',
    'Marshmallow Root (100mg)',
    'Slippery Elm Bark (75mg)'
  ]
}

function ShopPage() {
  const [quantity, setQuantity] = useState(1)
  const { isAuthenticated, loading: authLoading, profile } = useAuth()
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

  const totalPrice = PRODUCT_INFO.price * quantity
  const savings = (PRODUCT_INFO.originalPrice - PRODUCT_INFO.price) * quantity
  const appUserDiscount = totalPrice * 0.1 // 10% discount for app users
  const finalPrice = totalPrice - appUserDiscount

  const handlePurchase = () => {
    const utmParams = new URLSearchParams({
      utm_source: 'ohmygerd_app',
      utm_medium: 'referral',
      utm_campaign: 'app_purchase',
      utm_content: 'product_page',
      user_id: profile?.id || 'anonymous',
      quantity: quantity.toString(),
      discount_applied: 'app_user_10_percent'
    })
    
    const liaoUrl = `https://liaoherbal.com/products/reflux-relief?${utmParams.toString()}`
    window.open(liaoUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary-800">
              Natural GERD Relief
            </h1>
            <p className="text-text-secondary">
              Exclusive discount for OhMyGerd app users
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary-50 to-background flex items-center justify-center">
                <div className="text-center p-8">
                  <img src="/liao-logo.png" alt="Liao Herbal" className="h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary-800 mb-2">
                    {PRODUCT_INFO.name}
                  </h3>
                  <p className="text-text-secondary">
                    Premium Natural Formula
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-accent" />
                  Why Choose Liao?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PRODUCT_INFO.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-accent bg-accent-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{PRODUCT_INFO.name}</CardTitle>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(PRODUCT_INFO.rating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-text-secondary">
                        {PRODUCT_INFO.rating} ({PRODUCT_INFO.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                    App Exclusive
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-text-secondary">Regular Price:</span>
                    <span className="text-lg line-through text-text-muted">
                      ${PRODUCT_INFO.originalPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-text-secondary">Sale Price:</span>
                    <span className="text-lg font-semibold text-primary-800">
                      ${PRODUCT_INFO.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-accent font-semibold">
                    <span>App User Discount (10%):</span>
                    <span>-${appUserDiscount.toFixed(2)}</span>
                  </div>
                  <hr className="border-accent" />
                  <div className="flex items-center justify-between text-xl font-bold text-primary-800">
                    <span>Your Price:</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="text-lg font-semibold px-4">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        You're saving ${(savings + appUserDiscount).toFixed(2)} with this purchase!
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    size="lg"
                    className="w-full"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Buy Now - ${finalPrice.toFixed(2)}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-sm text-text-muted text-center">
                    Redirects to liaoherbal.com with your exclusive discount applied
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-clay-600" />
                  Product Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PRODUCT_INFO.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-primary-700 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Natural Ingredients</CardTitle>
                <CardDescription>
                  Premium herbs selected for digestive wellness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRODUCT_INFO.ingredients.map((ingredient, index) => (
                    <div key={index} className="text-sm text-text-secondary">
                      • {ingredient}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-primary-800 mb-4">
                Track Your Progress with OhMyGerd
              </h3>
              <p className="text-text-secondary mb-6">
                Continue using our app to monitor how Liao Reflux Relief improves your symptoms.
                Data-driven insights help optimize your wellness journey.
              </p>
              <Link href="/dashboard">
                <Button variant="outline">
                  View Your Progress
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(ShopPage), { ssr: false })