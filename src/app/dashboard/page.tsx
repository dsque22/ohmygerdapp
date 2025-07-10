'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useTracking } from '@/hooks/useTracking'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LineChart } from '@/components/charts/LineChart'
import { BarChart } from '@/components/charts/BarChart'
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Moon, 
  Zap, 
  CheckCircle,
  Clock,
  BarChart3,
  ShoppingBag
} from 'lucide-react'
import { formatDate, TRIGGER_FOOD_LABELS } from '@/lib/utils'

function DashboardPage() {
  const { isAuthenticated, loading: authLoading, profile } = useAuth()
  const { 
    entries, 
    loading, 
    hasTrackedToday, 
    getWeeklyEntries, 
    getAverageScores, 
    getStreak, 
    getTreatmentConsistency,
    getMostCommonTriggers 
  } = useTracking()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-2xl font-bold text-primary-800">Loading Dashboard...</div>
        </div>
      </div>
    )
  }

  const weeklyEntries = getWeeklyEntries()
  const averageScores = getAverageScores('week')
  const streak = getStreak()
  const treatmentConsistency = getTreatmentConsistency('week')
  const commonTriggers = getMostCommonTriggers('week')

  const chartData = weeklyEntries.map(entry => ({
    date: entry.entry_date,
    discomfort: entry.discomfort_level,
    heartburn: entry.heartburn_intensity,
    sleep: entry.sleep_disruption,
  })).reverse()

  const triggerChartData = commonTriggers.map(({ trigger, count }) => ({
    name: TRIGGER_FOOD_LABELS[trigger] || trigger,
    value: count,
  }))

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-green-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Good'
    if (score <= 6) return 'Moderate'
    return 'High'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Welcome back, {profile?.first_name}!
            </h1>
            <p className="text-text-secondary">
              Here's your GERD tracking overview
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link href="/shop">
              <Button variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop
              </Button>
            </Link>
            <Link href="/tracking">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {hasTrackedToday ? 'Update Today' : 'Track Today'}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Calendar className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">{streak}</div>
              <p className="text-xs text-text-muted">
                {streak === 1 ? 'day' : 'days'} of tracking
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Discomfort</CardTitle>
              <Zap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(averageScores.discomfort)}`}>
                {averageScores.discomfort.toFixed(1)}
              </div>
              <p className="text-xs text-text-muted">
                {getScoreLabel(averageScores.discomfort)} - This week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Heartburn</CardTitle>
              <Heart className="h-4 w-4 text-clay-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(averageScores.heartburn)}`}>
                {averageScores.heartburn.toFixed(1)}
              </div>
              <p className="text-xs text-text-muted">
                {getScoreLabel(averageScores.heartburn)} - This week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treatment Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {treatmentConsistency.overall}%
              </div>
              <p className="text-xs text-text-muted">
                Liao doses taken this week
              </p>
            </CardContent>
          </Card>
        </div>

        {!hasTrackedToday && (
          <Card className="mb-8 border-accent bg-accent-50">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-accent mr-3" />
                <div>
                  <h3 className="font-semibold text-text-primary">
                    Ready for your daily check-in?
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Track today's symptoms in just 2 minutes
                  </p>
                </div>
              </div>
              <Link href="/tracking">
                <Button>
                  Start Tracking
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-700" />
                Weekly Symptom Trends
              </CardTitle>
              <CardDescription>
                Track your discomfort, heartburn, and sleep patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <LineChart
                  data={chartData}
                  lines={[
                    { dataKey: 'discomfort', name: 'Discomfort', color: '#14301f' },
                    { dataKey: 'heartburn', name: 'Heartburn', color: '#df6552' },
                    { dataKey: 'sleep', name: 'Sleep', color: '#ea8952' },
                  ]}
                  height={300}
                />
              ) : (
                <div className="h-72 flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start tracking to see your trends</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="w-5 h-5 mr-2 text-peach-600" />
                Common Trigger Foods
              </CardTitle>
              <CardDescription>
                Your most frequently consumed trigger foods this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {triggerChartData.length > 0 ? (
                <BarChart
                  data={triggerChartData}
                  color="#df6552"
                  height={300}
                />
              ) : (
                <div className="h-72 flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No trigger foods recorded this week</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Treatment Consistency</CardTitle>
            <CardDescription>
              Your Liao Reflux Relief usage this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-800 mb-2">
                  {treatmentConsistency.morning}%
                </div>
                <p className="text-sm text-text-secondary">Morning doses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-800 mb-2">
                  {treatmentConsistency.evening}%
                </div>
                <p className="text-sm text-text-secondary">Evening doses</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {treatmentConsistency.overall}%
                </div>
                <p className="text-sm text-text-secondary">Overall consistency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-text-muted text-sm">
            Need support? Visit our{' '}
            <Link href="/shop" className="text-accent hover:text-accent-dark underline">
              shop
            </Link>{' '}
            for Liao Reflux Relief products
          </p>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false })