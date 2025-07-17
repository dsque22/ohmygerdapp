'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  Users, 
  TrendingUp, 
  Activity, 
  ShoppingBag,
  Calendar,
  BarChart3,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

function AdminPage() {
  const { isAuthenticated, loading: authLoading, isAdmin } = useAuth()
  const { loading: adminLoading, error, stats, refreshStats } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, isAdmin, router])

  const totalUsersForDemographics = stats ? Object.values(stats.ageGroups).reduce((a, b) => a + b, 0) : 0
  const totalUsersForGerd = stats ? Object.values(stats.gerdDurations).reduce((a, b) => a + b, 0) : 0

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-2xl font-bold text-primary-800">Loading Admin Dashboard...</div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Error Loading Data</h2>
            <p className="text-text-secondary">{error}</p>
            <Button onClick={refreshStats} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary">
              OhMyGerd app analytics and user insights
            </p>
          </div>
          <Button onClick={refreshStats} variant="outline" disabled={adminLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${adminLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="animate-slide-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-primary-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-800">{stats.totalUsers.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle>
                  <Activity className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.activeUsers.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Entries (7d)</CardTitle>
                  <Calendar className="h-4 w-4 text-clay-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-clay-600">{stats.dailyEntries.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Symptom Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.avgSymptomScore}</div>
                  <p className="text-xs text-text-muted">Mock Data</p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Treatment Compliance</CardTitle>
                  <BarChart3 className="h-4 w-4 text-peach-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-peach-600">{stats.treatmentCompliance}%</div>
                  <p className="text-xs text-text-muted">Mock Data</p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shop Conversions</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-primary-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-700">{stats.shopConversions}%</div>
                  <p className="text-xs text-text-muted">Mock Data</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>User Age Demographics</CardTitle>
                  <CardDescription>
                    Breakdown of user age groups from {totalUsersForDemographics} users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.ageGroups).map(([age, count], index) => {
                      const percentage = totalUsersForDemographics > 0 ? (count / totalUsersForDemographics) * 100 : 0;
                      const colors = ['bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500'];
                      const colorClass = colors[index % colors.length];
                      return (
                        <div key={age}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{age}</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GERD Duration Distribution</CardTitle>
                  <CardDescription>
                    How long users have been experiencing symptoms ({totalUsersForGerd} users)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.gerdDurations).map(([duration, count], index) => {
                      const percentage = totalUsersForGerd > 0 ? (count / totalUsersForGerd) * 100 : 0;
                      const colors = ['bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-orange-500'];
                      const colorClass = colors[index % colors.length];
                      return (
                        <div key={duration}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{duration.replace(/_/g, ' ')}</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                    </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(AdminPage), { ssr: false })