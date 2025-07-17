import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useAdmin() {
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  const fetchAdminStats = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Note: Supabase RPC functions would be more efficient for a real app.
      // For this demo, we'll do parallel queries.
      const [totalUsers, activeUsers, dailyEntries, userDemographics] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('daily_entries').select('user_id', { count: 'exact' }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('daily_entries').select('id', { count: 'exact' }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('users').select('age, gerd_duration')
      ])

      if (totalUsers.error) throw new Error(totalUsers.error.message)
      if (activeUsers.error) throw new Error(activeUsers.error.message)
      if (dailyEntries.error) throw new Error(dailyEntries.error.message)
      if (userDemographics.error) throw new Error(userDemographics.error.message)

      const uniqueActiveUsers = new Set(activeUsers.data?.map(e => e.user_id)).size

      // Process demographics
      const ageGroups = {
        '18-24': 0,
        '25-35': 0,
        '36-45': 0,
        '46-55': 0,
        '55+': 0,
      }
      userDemographics.data?.forEach(user => {
        if (user.age >= 18 && user.age <= 24) ageGroups['18-24']++
        else if (user.age >= 25 && user.age <= 35) ageGroups['25-35']++
        else if (user.age >= 36 && user.age <= 45) ageGroups['36-45']++
        else if (user.age >= 46 && user.age <= 55) ageGroups['46-55']++
        else if (user.age > 55) ageGroups['55+']++
      })

      const gerdDurations = {
        less_than_1_year: 0,
        '1_to_5_years': 0,
        '5_to_10_years': 0,
        more_than_10_years: 0,
      }
      userDemographics.data?.forEach(user => {
        if (user.gerd_duration) {
          gerdDurations[user.gerd_duration as keyof typeof gerdDurations]++
        }
      })

      setStats({
        totalUsers: totalUsers.count || 0,
        activeUsers: uniqueActiveUsers,
        dailyEntries: dailyEntries.count || 0,
        ageGroups,
        gerdDurations,
        // Mock data for stats not easily calculable with simple queries
        avgSymptomScore: 4.2, 
        treatmentCompliance: 78,
        shopConversions: 23
      })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchAdminStats()
  }, [fetchAdminStats])

  return { loading, error, stats, refreshStats: fetchAdminStats }
}
