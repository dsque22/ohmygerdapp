import { useState, useEffect } from 'react'

// Demo auth hook that works without Supabase for development/testing
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true) // Start with true, then set to false after init

  // Initialize without user for proper login flow
  useEffect(() => {
    // Check for existing session in localStorage (for persistence)
    const savedSession = localStorage.getItem('demo-session')
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession)
        // Update the profile to ensure admin access
        const updatedProfile = {
          ...sessionData.profile,
          is_admin: true // Force admin access for demo
        }
        setUser(sessionData.user)
        setProfile(updatedProfile)
        setSession(sessionData.session)
      } catch (error) {
        // If there's an error parsing, clear the session
        localStorage.removeItem('demo-session')
      }
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { data: { user: { id: 'new-user', email } }, error: null }
  }

  const signIn = async (email: string, password: string) => {
    // Mock signin
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate successful login by setting user state
    const demoUser = {
      id: 'demo-user-123',
      email: email,
    }
    
    const demoProfile = {
      id: 'demo-user-123',
      email: email,
      first_name: 'John',
      last_name: 'Doe',
      age: 35,
      gender: 'male',
      gerd_duration: '1_to_5_years',
      worst_symptoms: ['heartburn', 'regurgitation'],
      liao_customer_status: 'current_customer',
      known_triggers: ['spicy_foods', 'coffee'],
      is_admin: true,
    }
    
    setUser(demoUser)
    setProfile(demoProfile)
    setSession({ user: demoUser })
    
    // Save session to localStorage for persistence (with admin access)
    const profileWithAdmin = { ...demoProfile, is_admin: true }
    localStorage.setItem('demo-session', JSON.stringify({
      user: demoUser,
      profile: profileWithAdmin,
      session: { user: demoUser }
    }))
    
    // Update the profile state with admin access
    setProfile(profileWithAdmin)
    
    return { data: { user: demoUser }, error: null }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    setSession(null)
    localStorage.removeItem('demo-session')
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    return { error: null }
  }

  const updateProfile = async (updates: any) => {
    setProfile((prev: any) => ({ ...prev, ...updates }))
    return { error: null }
  }

  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin || false
  }
}