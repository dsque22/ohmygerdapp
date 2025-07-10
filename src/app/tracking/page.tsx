'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTracking } from '@/hooks/useTracking'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import { Checkbox } from '@/components/ui/Checkbox'
import { Toggle } from '@/components/ui/Toggle'
import { Heart, Moon, Zap, Plus, Save, CheckCircle } from 'lucide-react'
import { SYMPTOMS, TRIGGER_FOODS, SYMPTOM_LABELS, TRIGGER_FOOD_LABELS } from '@/lib/utils'

interface TrackingFormData {
  discomfortLevel: number
  heartburnIntensity: number
  sleepDisruption: number
  symptoms: string[]
  morningDose: boolean
  eveningDose: boolean
  triggerFoods: string[]
  notes: string
}

function TrackingPage() {
  const [formData, setFormData] = useState<TrackingFormData>({
    discomfortLevel: 1,
    heartburnIntensity: 1,
    sleepDisruption: 1,
    symptoms: [],
    morningDose: false,
    eveningDose: false,
    triggerFoods: [],
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { isAuthenticated, loading: authLoading } = useAuth()
  const { createEntry, updateEntry, todayEntry, hasTrackedToday, fetchTodayEntry } = useTracking()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (todayEntry) {
      setFormData({
        discomfortLevel: todayEntry.discomfort_level,
        heartburnIntensity: todayEntry.heartburn_intensity,
        sleepDisruption: todayEntry.sleep_disruption,
        symptoms: todayEntry.symptoms,
        morningDose: todayEntry.morning_dose,
        eveningDose: todayEntry.evening_dose,
        triggerFoods: todayEntry.trigger_foods,
        notes: todayEntry.notes || '',
      })
    }
  }, [todayEntry])

  const handleArrayToggle = (field: 'symptoms' | 'triggerFoods', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const entryData = {
        entry_date: new Date().toISOString().split('T')[0],
        discomfort_level: formData.discomfortLevel,
        heartburn_intensity: formData.heartburnIntensity,
        sleep_disruption: formData.sleepDisruption,
        symptoms: formData.symptoms,
        morning_dose: formData.morningDose,
        evening_dose: formData.eveningDose,
        trigger_foods: formData.triggerFoods,
        notes: formData.notes,
      }

      let result
      if (hasTrackedToday && todayEntry) {
        result = await updateEntry(todayEntry.id, entryData)
      } else {
        result = await createEntry(entryData)
      }

      if (result.error) {
        setError(result.error.message)
        return
      }

      setSuccess(true)
      await fetchTodayEntry()
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-2xl font-bold text-primary-800">Loading...</div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {hasTrackedToday ? 'Entry Updated!' : 'Entry Saved!'}
            </h2>
            <p className="text-text-secondary">
              Your symptoms have been recorded. Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">
            {hasTrackedToday ? 'Update Today\'s Entry' : 'Daily Symptom Tracking'}
          </h1>
          <p className="text-text-secondary">
            Take 2 minutes to track how you're feeling today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-accent" />
                Symptom Levels
              </CardTitle>
              <CardDescription>
                Rate your symptoms on a scale of 1-10
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Slider
                label="Overall Discomfort Level"
                min={1}
                max={10}
                value={formData.discomfortLevel}
                onChange={(value) => setFormData(prev => ({ ...prev, discomfortLevel: value }))}
                color="primary"
                showValue
              />
              
              <Slider
                label="Heartburn Intensity"
                min={1}
                max={10}
                value={formData.heartburnIntensity}
                onChange={(value) => setFormData(prev => ({ ...prev, heartburnIntensity: value }))}
                color="accent"
                showValue
              />
              
              <Slider
                label="Sleep Disruption"
                min={1}
                max={10}
                value={formData.sleepDisruption}
                onChange={(value) => setFormData(prev => ({ ...prev, sleepDisruption: value }))}
                color="red"
                showValue
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-clay-600" />
                Today's Symptoms
              </CardTitle>
              <CardDescription>
                Select all symptoms you experienced today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYMPTOMS.map(symptom => (
                  <Checkbox
                    key={symptom}
                    label={SYMPTOM_LABELS[symptom]}
                    checked={formData.symptoms.includes(symptom)}
                    onChange={() => handleArrayToggle('symptoms', symptom)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-primary-700" />
                Liao Treatment
              </CardTitle>
              <CardDescription>
                Track your Liao Reflux Relief doses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toggle
                label="Morning Dose"
                description="Did you take Liao this morning?"
                checked={formData.morningDose}
                onChange={(checked) => setFormData(prev => ({ ...prev, morningDose: checked }))}
              />
              
              <Toggle
                label="Evening Dose"
                description="Did you take Liao this evening?"
                checked={formData.eveningDose}
                onChange={(checked) => setFormData(prev => ({ ...prev, eveningDose: checked }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="w-5 h-5 mr-2 text-peach-600" />
                Trigger Foods
              </CardTitle>
              <CardDescription>
                Select any trigger foods you consumed today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRIGGER_FOODS.map(food => (
                  <Checkbox
                    key={food}
                    label={TRIGGER_FOOD_LABELS[food]}
                    checked={formData.triggerFoods.includes(food)}
                    onChange={() => handleArrayToggle('triggerFoods', food)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Any other observations about your day? (Optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g., stressed at work, tried a new recipe, felt great after walk..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                maxLength={500}
              />
              <div className="text-sm text-text-muted mt-1">
                {formData.notes.length}/500 characters
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {hasTrackedToday ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(TrackingPage), { ssr: false })