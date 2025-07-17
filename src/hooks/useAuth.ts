import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
        }
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            setProfile(null)
          }
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    console.log('fetchUserProfile: Attempting to fetch profile for userId:', userId);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('useAuth: Supabase error in fetchUserProfile:', error); // Log the full Supabase error object
        if (error.code !== 'PGRST116') {
          // This is an unexpected error, not just "no row found"
          console.error('useAuth: Unexpected Supabase error code:', error.code);
          console.error('useAuth: Unexpected Supabase error message:', error.message);
        }
        setProfile(null);
        return;
      }

      console.log('useAuth: User profile fetched successfully:', data);
      setProfile(data);
    } catch (err: any) {
      console.error('useAuth: Catch block - Unexpected JavaScript error in fetchUserProfile:', err); // Log the full JS error object
      console.error('useAuth: Catch block - Error message:', err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    first_name: string
    last_name: string
    age: number
    gender: string
    gerd_duration: string
    worst_symptoms: string[]
    liao_customer_status: string
    known_triggers: string[]
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/survey`
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // No redirectTo here, will be handled by the client-side logic
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)

      if (error) throw error

      await fetchUserProfile(userId)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_user_account')
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const isProfileComplete = profile?.gerd_duration !== null;
  
  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    deleteAccount,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin || false,
    isProfileComplete
  }
}

