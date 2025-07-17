'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { ChevronLeft, ChevronRight, User, Clock, Heart, Package } from 'lucide-react'
import { SYMPTOMS, TRIGGER_FOODS, SYMPTOM_LABELS, TRIGGER_FOOD_LABELS } from '@/lib/utils'

interface SurveyData {
  firstName: string
  lastName: string
  age: number
  gender: string
  gerdDuration: string
  worstSymptoms: string[]
  liaoCustomerStatus: string
  knownTriggers: string[]
}

const STEPS = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'GERD Duration', icon: Clock },
  { id: 3, title: 'Symptom Assessment', icon: Heart },
  { id: 4, title: 'Liao Usage', icon: Package },
  { id: 5, title: 'Trigger Foods', icon: Heart },
  { id: 6, title: 'Completion', icon: ChevronRight },
]

function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    firstName: '',
    lastName: '',
    age: 0,
    gender: '',
    gerdDuration: '',
    worstSymptoms: [],
    liaoCustomerStatus: '',
    knownTriggers: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { user, updateProfile, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) { // Only run this check once authLoading is false
      if (!user) {
        router.push('/login');
      } else {
        // Pre-fill survey data if available from user metadata (e.g., from Google OAuth)
        const { user_metadata } = user;
        if (user_metadata) {
          const newSurveyData: Partial<SurveyData> = {};
          if (user_metadata.full_name) {
            const [firstName, ...lastNameParts] = user_metadata.full_name.split(' ');
            newSurveyData.firstName = firstName || '';
            newSurveyData.lastName = lastNameParts.join(' ') || '';
          }
          if (user_metadata.email) {
            // Optionally pre-fill email if needed, though not part of surveyData state
          }
          // You might also check for other fields if Google provides them

          setSurveyData(prev => ({ ...prev, ...newSurveyData }));
        }
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-4xl font-bold text-primary-800">Loading...</div>
        </div>
      </div>
    );
  }

  const updateSurveyData = (field: keyof SurveyData, value: any) => {
    setSurveyData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: 'worstSymptoms' | 'knownTriggers', value: string) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      if (!user) {
        setError('No user logged in. Please try logging in again.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await updateProfile(user.id, {
        first_name: surveyData.firstName,
        last_name: surveyData.lastName,
        age: surveyData.age,
        gender: surveyData.gender,
        gerd_duration: surveyData.gerdDuration,
        worst_symptoms: surveyData.worstSymptoms,
        liao_customer_status: surveyData.liaoCustomerStatus,
        known_triggers: surveyData.knownTriggers,
      })

      if (error) {
        setError(error.message || 'Failed to save survey data')
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return surveyData.firstName && surveyData.lastName && surveyData.age > 0 && surveyData.gender
      case 2:
        return surveyData.gerdDuration
      case 3:
        return surveyData.worstSymptoms.length > 0
      case 4:
        return surveyData.liaoCustomerStatus
      case 5:
        return true
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="First Name"
                value={surveyData.firstName}
                onChange={(e) => updateSurveyData('firstName', e.target.value)}
                placeholder="Enter your first name"
                required
              />
              <Input
                type="text"
                label="Last Name"
                value={surveyData.lastName}
                onChange={(e) => updateSurveyData('lastName', e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>
            
            <Input
              type="number"
              label="Age"
              value={surveyData.age || ''}
              onChange={(e) => updateSurveyData('age', parseInt(e.target.value) || 0)}
              placeholder="Enter your age"
              min="18"
              max="120"
              required
            />
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">Gender</label>
              <div className="space-y-2">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                ].map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={option.value}
                      name="gender"
                      value={option.value}
                      checked={surveyData.gender === option.value}
                      onChange={(e) => updateSurveyData('gender', e.target.value)}
                      className="w-4 h-4 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      style={{
                        accentColor: '#df6552'
                      }}
                    />
                    <label htmlFor={option.value} className="text-sm text-text-primary">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              How long have you been experiencing GERD symptoms?
            </label>
            <div className="space-y-2">
              {[
                { value: 'less_than_1_year', label: 'Less than 1 year' },
                { value: '1_to_5_years', label: '1 to 5 years' },
                { value: '5_to_10_years', label: '5 to 10 years' },
                { value: 'more_than_10_years', label: 'More than 10 years' },
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option.value}
                    name="gerdDuration"
                    value={option.value}
                    checked={surveyData.gerdDuration === option.value}
                    onChange={(e) => updateSurveyData('gerdDuration', e.target.value)}
                    className="w-4 h-4 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    style={{
                      accentColor: '#df6552'
                    }}
                  />
                  <label htmlFor={option.value} className="text-sm text-text-primary">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-primary">
              What are your most troublesome GERD symptoms? (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SYMPTOMS.map(symptom => (
                <Checkbox
                  key={symptom}
                  label={SYMPTOM_LABELS[symptom]}
                  checked={surveyData.worstSymptoms.includes(symptom)}
                  onChange={() => handleArrayToggle('worstSymptoms', symptom)}
                />
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-primary">
              Are you a Liao customer?
            </label>
            <div className="space-y-2">
              {[
                { value: 'current_customer', label: 'Yes' },
                { value: 'not_interested', label: 'No' },
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={option.value}
                    name="liaoCustomerStatus"
                    value={option.value}
                    checked={surveyData.liaoCustomerStatus === option.value}
                    onChange={(e) => updateSurveyData('liaoCustomerStatus', e.target.value)}
                    className="w-4 h-4 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    style={{
                      accentColor: '#df6552'
                    }}
                  />
                  <label htmlFor={option.value} className="text-sm text-text-primary">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-primary">
              Which foods typically trigger your GERD symptoms? (Optional - select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRIGGER_FOODS.map(food => (
                <Checkbox
                  key={food}
                  label={TRIGGER_FOOD_LABELS[food]}
                  checked={surveyData.knownTriggers.includes(food)}
                  onChange={() => handleArrayToggle('knownTriggers', food)}
                />
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <ChevronRight className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                Welcome to OhMyGerd!
              </h3>
              <p className="text-text-secondary">
                Your profile is now complete. You're ready to start tracking your GERD journey and 
                discovering patterns that lead to better health.
              </p>
            </div>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">
            Welcome! Let's get to know you
          </h1>
          <p className="text-text-secondary">
            This quick survey helps us personalize your GERD tracking experience
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isActive
                        ? 'border-primary-700 text-white'
                        : isCompleted
                        ? 'bg-green-100 border-green-500 text-green-600'
                        : 'bg-background border-gray-300 text-text-muted'
                    }`}
                    style={isActive ? { backgroundColor: '#df6552' } : {}}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className="text-center">
            <span className="text-sm text-text-secondary">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center font-sans">{STEPS[currentStep - 1]?.title}</CardTitle>
            <CardDescription>
              {currentStep === 6
                ? 'Your survey is complete!'
                : 'Please provide the following information to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === STEPS.length ? (
                <Button
                  onClick={handleComplete}
                  loading={isSubmitting}
                  className="ml-auto"
                  disabled={!user || authLoading || isSubmitting} // Disable if no user, auth is loading, or submitting
                >
                  Complete Setup
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="ml-auto"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(SurveyPage), { ssr: false })