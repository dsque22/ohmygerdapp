'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Toggle } from '@/components/ui/Toggle'
import { 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  Save,
  ArrowLeft,
  Trash2,
  Download
} from 'lucide-react'

function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
  })
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklySummary: true,
    pushNotifications: true,
  })
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analyticsTracking: true,
  })

  const { isAuthenticated, loading: authLoading, profile, updateProfile, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        age: profile.age || 0,
      })
    }
  }, [profile])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <div className="text-2xl font-bold text-primary-800">Loading...</div>
        </div>
      </div>
    )
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        age: profileData.age,
      })

      if (error) {
        setError('Failed to update profile')
        return
      }

      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion logic here
      alert('Account deletion would be implemented here')
    }
  }

  const handleExportData = () => {
    // Implement data export logic here
    alert('Data export would be implemented here')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary-800">Settings</h1>
            <p className="text-text-secondary">Manage your account and preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-700" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                    required
                  />
                  <Input
                    label="Last Name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  placeholder="Your email address"
                  disabled
                  helperText="Email cannot be changed. Contact support if needed."
                />
                
                <Input
                  label="Age"
                  type="number"
                  value={profileData.age || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter your age"
                  min="18"
                  max="120"
                  required
                />

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                    {success}
                  </div>
                )}

                <Button type="submit" loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-accent" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toggle
                label="Daily Tracking Reminder"
                description="Get reminded to track your symptoms each day"
                checked={notifications.dailyReminder}
                onChange={(checked) => setNotifications(prev => ({ ...prev, dailyReminder: checked }))}
              />
              
              <Toggle
                label="Weekly Summary"
                description="Receive a summary of your week's progress"
                checked={notifications.weeklySummary}
                onChange={(checked) => setNotifications(prev => ({ ...prev, weeklySummary: checked }))}
              />
              
              <Toggle
                label="Push Notifications"
                description="Allow browser notifications for important updates"
                checked={notifications.pushNotifications}
                onChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-clay-600" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Manage your privacy settings and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toggle
                label="Anonymous Data Sharing"
                description="Help improve our service by sharing anonymized health trends"
                checked={privacy.dataSharing}
                onChange={(checked) => setPrivacy(prev => ({ ...prev, dataSharing: checked }))}
              />
              
              <Toggle
                label="Analytics Tracking"
                description="Allow us to track app usage to improve your experience"
                checked={privacy.analyticsTracking}
                onChange={(checked) => setPrivacy(prev => ({ ...prev, analyticsTracking: checked }))}
              />

              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Data export includes all your tracking data. Account deletion is permanent and cannot be undone.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <LogOut className="w-5 h-5 mr-2" />
                Account Actions
              </CardTitle>
              <CardDescription className="text-red-600">
                Sign out of your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-text-muted text-sm">
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@liaoherbal.com" 
              className="text-accent hover:text-accent-dark underline"
            >
              support@liaoherbal.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(SettingsPage), { ssr: false })