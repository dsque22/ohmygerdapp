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
import { BottomNavigation } from '@/components/ui/BottomNavigation'
import { 
  Plus, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Zap, 
  CheckCircle,
  Clock,
  BarChart3,
  ShoppingBag,
  Settings,
  Flame
} from 'lucide-react'
import { formatDate, TRIGGER_FOOD_LABELS } from '@/lib/utils'

function DashboardPage() {
  const { isAuthenticated, loading: authLoading, profile, isProfileComplete } = useAuth()
  const { 
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
    console.log(isProfileComplete)
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }else{
      if (!isProfileComplete) {
        router.push('/survey')
      }
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

  const weeklyEntries = getWeeklyEntries() || []
  const averageScores = getAverageScores('week') || { discomfort: 0, heartburn: 0, sleep: 0 }
  const streak = getStreak() || 0
  const treatmentConsistency = getTreatmentConsistency('week') || { overall: 0, morning: 0, evening: 0 }
  const commonTriggers = getMostCommonTriggers('week') || []

  const chartData = (weeklyEntries || []).map(entry => ({
    date: entry.entry_date,
    discomfort: entry.discomfort_level,
    heartburn: entry.heartburn_intensity,
    sleep: entry.sleep_disruption,
  })).reverse()

  const triggerChartData = (commonTriggers || []).map(({ trigger, count }) => ({
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
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20 sm:pb-8 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <img src="/liao-logo.png" alt="Liao Herbal" className="h-8" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              Welcome back, {profile?.first_name}!
            </h1>
            <p className="text-text-secondary">
              Here's your GERD tracking overview
            </p>
          </div>
          
          {/* Mobile Track Today button */}
          <div className="sm:hidden mt-4">
            <Link href="/tracking">
              <Button
                className="font-sans text-white px-6 py-3 rounded-xl shadow-lg"
                style={{ backgroundColor: '#df6552' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Track Today
              </Button>
            </Link>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex gap-3 mt-4 sm:mt-0">
            <Link href="/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop
              </Button>
            </Link>
            <Link href="/tracking">
              <Button
                className="font-sans text-white"
                style={{ backgroundColor: '#df6552' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Track Today
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm sm:text-base font-bold font-sans">Current Streak</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
            </CardHeader>
            <CardContent className="pt-1">
              <div className="text-xl sm:text-2xl font-bold text-primary-800">{streak}</div>
              <p className="text-xs text-text-muted">
                {streak === 1 ? 'day' : 'days'} of tracking
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm sm:text-base font-bold font-sans">Avg Discomfort</CardTitle>
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
            </CardHeader>
            <CardContent className="pt-1">
              <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(averageScores.discomfort)}`}>
                {averageScores.discomfort.toFixed(1)}
              </div>
              <p className="text-xs text-text-muted">
                {getScoreLabel(averageScores.discomfort)} - This week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm sm:text-base font-bold font-sans">Avg Heartburn</CardTitle>
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-clay-600" />
            </CardHeader>
            <CardContent className="pt-1">
              <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(averageScores.heartburn)}`}>
                {averageScores.heartburn.toFixed(1)}
              </div>
              <p className="text-xs text-text-muted">
                {getScoreLabel(averageScores.heartburn)} - This week
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm sm:text-base font-bold font-sans">Treatment Rate</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </CardHeader>
            <CardContent className="pt-1">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
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
            <CardHeader>
              <CardTitle className="text-lg font-bold text-accent">
                Haven't tracked today yet?
              </CardTitle>
              <CardDescription>
                Keep your streak going! Track your symptoms to see your progress over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tracking">
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Track Today's Symptoms
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 font-sans text-center">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                Weekly Symptom Trends
              </CardTitle>
              <CardDescription className="text-center">
                Track your discomfort, heartburn, and sleep patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="-mx-6 sm:mx-0">
              {chartData && chartData.length > 0 ? (
                <div className="w-full">
                  <LineChart 
                    data={chartData}
                    lines={[
                      { dataKey: 'discomfort', name: 'Discomfort', color: '#df6552' },
                      { dataKey: 'heartburn', name: 'Heartburn', color: '#f59e0b' },
                      { dataKey: 'sleep', name: 'Sleep Disruption', color: '#8b5cf6' }
                    ]}
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-text-muted" />
                    <p>No data available yet</p>
                    <p className="text-sm">Start tracking to see your trends</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 font-sans text-center">
                <Flame className="h-5 w-5 text-clay-600" />
                Food Triggers
              </CardTitle>
              <CardDescription className="text-center">
                Foods that most often triggered your symptoms this week
              </CardDescription>
            </CardHeader>
            <CardContent className="-mx-6 sm:mx-0">
              {triggerChartData && triggerChartData.length > 0 ? (
                <div className="w-full">
                  <BarChart 
                    data={triggerChartData} 
                    color="#df6552"
                  />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <Flame className="h-12 w-12 mx-auto mb-4 text-text-muted" />
                    <p>No trigger data yet</p>
                    <p className="text-sm">Track your meals to identify patterns</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 font-sans text-center">
                <Clock className="h-5 w-5 text-primary-600" />
                This Week's Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Entries logged</span>
                <span className="font-semibold">{weeklyEntries.length}/7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Best day</span>
                <span className="font-semibold">
                  {weeklyEntries && weeklyEntries.length > 0 
                    ? formatDate(weeklyEntries.sort((a, b) => 
                        (a.discomfort_level + a.heartburn_intensity) - 
                        (b.discomfort_level + b.heartburn_intensity)
                      )[0]?.entry_date || '')
                    : 'No data'
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 font-sans text-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Treatment Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Morning doses</span>
                  <span className="font-semibold text-green-600">
                    {treatmentConsistency.morning}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Evening doses</span>
                  <span className="font-semibold text-green-600">
                    {treatmentConsistency.evening}%
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall consistency</span>
                    <span className="font-bold text-green-600">
                      {treatmentConsistency.overall}%
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-2">
                    {treatmentConsistency.overall >= 80 
                      ? "Excellent consistency! Keep it up." 
                      : "Try to maintain regular dosing for best results."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false })