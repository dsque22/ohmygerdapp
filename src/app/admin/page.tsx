'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Users, 
  TrendingUp, 
  Activity, 
  ShoppingBag,
  Calendar,
  BarChart3,
  AlertCircle
} from 'lucide-react'

function AdminPage() {
  const { isAuthenticated, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, isAdmin, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-2xl font-bold text-primary-800">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Access Denied</h2>
            <p className="text-text-secondary">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock data for demonstration
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    dailyEntries: 1834,
    avgSymptomScore: 4.2,
    treatmentCompliance: 78,
    shopConversions: 23
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-text-secondary">
            OhMyGerd app analytics and user insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-text-muted">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-text-muted">
                71.5% of total users
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Entries</CardTitle>
              <Calendar className="h-4 w-4 text-clay-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-clay-600">{stats.dailyEntries.toLocaleString()}</div>
              <p className="text-xs text-text-muted">
                This week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Symptom Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.avgSymptomScore}</div>
              <p className="text-xs text-text-muted">
                Down 0.3 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treatment Compliance</CardTitle>
              <BarChart3 className="h-4 w-4 text-peach-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-peach-600">{stats.treatmentCompliance}%</div>
              <p className="text-xs text-text-muted">
                Users taking Liao regularly
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shop Conversions</CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-700">{stats.shopConversions}%</div>
              <p className="text-xs text-text-muted">
                Users who purchased
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>
                Breakdown of user age groups and GERD duration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ages 25-35</span>
                    <span>32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-700 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ages 36-45</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ages 46-55</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-clay-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Ages 55+</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-peach-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GERD Duration Distribution</CardTitle>
              <CardDescription>
                How long users have been experiencing symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Less than 1 year</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>1-5 years</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>5-10 years</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>More than 10 years</span>
                    <span>12%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-text-muted">user_1247@example.com</p>
                  </div>
                  <span className="text-xs text-text-muted">2 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium">Shop purchase completed</p>
                    <p className="text-xs text-text-muted">$89.99 - Liao Reflux Relief</p>
                  </div>
                  <span className="text-xs text-text-muted">15 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium">Daily tracking milestone</p>
                    <p className="text-xs text-text-muted">User reached 30-day streak</p>
                  </div>
                  <span className="text-xs text-text-muted">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">System backup completed</p>
                    <p className="text-xs text-text-muted">All user data backed up successfully</p>
                  </div>
                  <span className="text-xs text-text-muted">3 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(AdminPage), { ssr: false })