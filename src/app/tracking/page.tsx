'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTracking } from '@/hooks/useTracking'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import { Checkbox } from '@/components/ui/Checkbox'
import { Toggle } from '@/components/ui/Toggle'
import { BottomNavigation } from '@/components/ui/BottomNavigation'
import { Activity, Clipboard, Pill, Utensils, Save, CheckCircle, Settings, ShoppingBag, Home, Plus, X } from 'lucide-react'
import { SYMPTOMS, TRIGGER_FOODS, SYMPTOM_LABELS, TRIGGER_FOOD_LABELS } from '@/lib/utils'

interface TrackingFormData {
  discomfortLevel: number
  heartburnIntensity: number
  sleepDisruption: number
  symptoms: string[]
  morningDose: boolean
  eveningDose: boolean
  triggerFoods: string[]
  customSymptom: string
  customTriggerFood: string
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
    customSymptom: '',
    customTriggerFood: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { isAuthenticated, loading: authLoading, profile } = useAuth()
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
        customSymptom: '',
        customTriggerFood: '',
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

  const handleAddCustomSymptom = () => {
    if (formData.customSymptom.trim() && !formData.symptoms.includes(formData.customSymptom.trim())) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, prev.customSymptom.trim()],
        customSymptom: ''
      }))
    }
  }

  const handleAddCustomTriggerFood = () => {
    if (formData.customTriggerFood.trim() && !formData.triggerFoods.includes(formData.customTriggerFood.trim())) {
      setFormData(prev => ({
        ...prev,
        triggerFoods: [...prev.triggerFoods, prev.customTriggerFood.trim()],
        customTriggerFood: ''
      }))
    }
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32 sm:pb-8 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <img src="/liao-logo.png" alt="Liao Herbal" className="h-8" />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              {hasTrackedToday ? `Update Today's Entry, ${profile?.first_name}!` : `Daily Symptom Tracking, ${profile?.first_name}!`}
            </h1>
            <p className="text-text-secondary">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Mobile Dashboard button */}
          <div className="sm:hidden mt-4">
            <Link href="/dashboard">
              <Button
                className="font-sans text-white px-6 py-3 rounded-xl shadow-lg"
                style={{ backgroundColor: '#14301f' }}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex gap-3 mt-4 sm:mt-0">
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant="outline" 
                className="hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link href="/shop">
              <Button 
                variant="outline" 
                className="hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center sm:justify-start gap-2 font-sans text-center sm:text-left">
                <Activity className="w-5 h-5 text-accent" />
                Symptom Levels
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
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
                color="accent"
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
                color="accent"
                showValue
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center sm:justify-start gap-2 font-sans text-center sm:text-left">
                <Clipboard className="w-5 h-5 text-clay-600" />
                Today's Symptoms
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Select all symptoms you experienced today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {SYMPTOMS.map(symptom => (
                  <Checkbox
                    key={symptom}
                    label={SYMPTOM_LABELS[symptom]}
                    checked={formData.symptoms.includes(symptom)}
                    onChange={() => handleArrayToggle('symptoms', symptom)}
                  />
                ))}
              </div>
              
              {/* Custom symptoms that have been added */}
              {formData.symptoms.filter(symptom => !SYMPTOMS.includes(symptom as any)).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-text-primary mb-2">Custom Symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.symptoms.filter(symptom => !SYMPTOMS.includes(symptom as any)).map((customSymptom, index) => (
                      <div key={index} className="flex items-center bg-accent-light/20 text-accent-dark px-3 py-1 rounded-full text-sm">
                        <span>{customSymptom}</span>
                        <button
                          type="button"
                          onClick={() => handleArrayToggle('symptoms', customSymptom)}
                          className="ml-2 text-accent-dark hover:text-accent"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add custom symptom input */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Add Custom Symptom
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customSymptom}
                    onChange={(e) => setFormData(prev => ({ ...prev, customSymptom: e.target.value }))}
                    placeholder="Enter a custom symptom..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomSymptom}
                    disabled={!formData.customSymptom.trim()}
                    className="px-3 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center sm:justify-start gap-2 font-sans text-center sm:text-left">
                <Pill className="w-5 h-5 text-primary-700" />
                Liao Treatment
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Track your Liao Reflux Relief doses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toggle
                label="Morning Dose"
                description="Did you take Liao this morning?"
                checked={formData.morningDose}
                onChange={(checked) => setFormData(prev => ({ ...prev, morningDose: checked }))}
                color="accent"
              />
              
              <Toggle
                label="Evening Dose"
                description="Did you take Liao this evening?"
                checked={formData.eveningDose}
                onChange={(checked) => setFormData(prev => ({ ...prev, eveningDose: checked }))}
                color="accent"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center sm:justify-start gap-2 font-sans text-center sm:text-left">
                <Utensils className="w-5 h-5 text-peach-600" />
                Trigger Foods
              </CardTitle>
              <CardDescription className="text-center sm:text-left">
                Select any trigger foods you consumed today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {TRIGGER_FOODS.map(food => (
                  <Checkbox
                    key={food}
                    label={TRIGGER_FOOD_LABELS[food]}
                    checked={formData.triggerFoods.includes(food)}
                    onChange={() => handleArrayToggle('triggerFoods', food)}
                  />
                ))}
              </div>
              
              {/* Custom trigger foods that have been added */}
              {formData.triggerFoods.filter(food => !TRIGGER_FOODS.includes(food as any)).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-text-primary mb-2">Custom Trigger Foods:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.triggerFoods.filter(food => !TRIGGER_FOODS.includes(food as any)).map((customFood, index) => (
                      <div key={index} className="flex items-center bg-peach-200 text-peach-800 px-3 py-1 rounded-full text-sm">
                        <span>{customFood}</span>
                        <button
                          type="button"
                          onClick={() => handleArrayToggle('triggerFoods', customFood)}
                          className="ml-2 text-peach-800 hover:text-peach-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add custom trigger food input */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Add Custom Trigger Food
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customTriggerFood}
                    onChange={(e) => setFormData(prev => ({ ...prev, customTriggerFood: e.target.value }))}
                    placeholder="Enter a trigger food..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTriggerFood()}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomTriggerFood}
                    disabled={!formData.customTriggerFood.trim()}
                    className="px-3 py-2 bg-peach-600 hover:bg-peach-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
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
              className="flex-1 font-sans text-white"
              style={{ backgroundColor: '#df6552' }}
            >
              <Save className="w-4 h-4 mr-2" />
              {hasTrackedToday ? 'Update Today' : 'Save Today'}
            </Button>
          </div>
        </form>
        </div>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default dynamic(() => Promise.resolve(TrackingPage), { ssr: false })