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
  ShoppingBag,
  Settings
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
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <img src="/liao-logo.png" alt="Liao Herbal" className="h-8" />
        </div>
        
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
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                Weekly Symptom Trends
              </CardTitle>
              <CardDescription>
                Track your discomfort, heartburn, and sleep patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData && chartData.length > 0 ? (
                <LineChart 
                  data={chartData}
                  lines={[
                    { dataKey: 'discomfort', name: 'Discomfort', color: '#df6552' },
                    { dataKey: 'heartburn', name: 'Heartburn', color: '#f59e0b' },
                    { dataKey: 'sleep', name: 'Sleep Disruption', color: '#8b5cf6' }
                  ]}
                />
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
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-clay-600" />
                Common Triggers
              </CardTitle>
              <CardDescription>
                Foods that most often triggered your symptoms this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {triggerChartData && triggerChartData.length > 0 ? (
                <BarChart 
                  data={triggerChartData} 
                  color="#df6552"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-text-muted" />
                    <p>No trigger data yet</p>
                    <p className="text-sm">Track your meals to identify patterns</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
                <span className="text-sm text-text-secondary">Average sleep quality</span>
                <span className={`font-semibold ${getScoreColor(10 - averageScores.sleep)}`}>
                  {(10 - averageScores.sleep).toFixed(1)}/10
                </span>
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

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary-600" />
                Sleep Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(10 - averageScores.sleep)}`}>
                  {(10 - averageScores.sleep).toFixed(1)}
                </div>
                <p className="text-sm text-text-muted">
                  Average sleep quality this week
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Excellent (9-10)</span>
                    <span>{(weeklyEntries || []).filter(e => e.sleep_disruption <= 1).length} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Good (7-8)</span>
                    <span>{(weeklyEntries || []).filter(e => e.sleep_disruption > 1 && e.sleep_disruption <= 3).length} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Poor (1-6)</span>
                    <span>{(weeklyEntries || []).filter(e => e.sleep_disruption > 3).length} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
    </div>
  )
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false })