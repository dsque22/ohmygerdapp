import { useState, useEffect } from 'react'

// Demo auth hook that works without Supabase for development/testing
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false) // Start with false for demo

  // Mock user data
  useEffect(() => {
    // Simulate a demo user for testing
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@example.com',
    }
    
    const demoProfile = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      first_name: 'John',
      last_name: 'Doe',
      age: 35,
      gender: 'male',
      gerd_duration: '1_to_5_years',
      worst_symptoms: ['heartburn', 'regurgitation'],
      liao_customer_status: 'current_customer',
      known_triggers: ['spicy_foods', 'coffee'],
      is_admin: false,
    }

    // Simulate loading state briefly
    setTimeout(() => {
      setUser(demoUser)
      setProfile(demoProfile)
      setSession({ user: demoUser })
      setLoading(false)
    }, 100)
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { data: { user: { id: 'new-user', email } }, error: null }
  }

  const signIn = async (email: string, password: string) => {
    // Mock signin
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { data: { user: { id: 'demo-user', email } }, error: null }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    setSession(null)
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