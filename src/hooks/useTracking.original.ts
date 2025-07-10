import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { useAuth } from './useAuth'

type DailyEntry = Database['public']['Tables']['daily_entries']['Row']
type DailyEntryInsert = Database['public']['Tables']['daily_entries']['Insert']
type DailyEntryUpdate = Database['public']['Tables']['daily_entries']['Update']

export function useTracking() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchEntries()
      fetchTodayEntry()
    }
  }, [user])

  const fetchEntries = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })

      if (error) throw error

      setEntries(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch entries')
    } finally {
      setLoading(false)
    }
  }

  const fetchTodayEntry = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setTodayEntry(data || null)
    } catch (err) {
      console.error('Error fetching today entry:', err)
    }
  }

  const createEntry = async (entryData: Omit<DailyEntryInsert, 'user_id'>) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .insert([
          {
            ...entryData,
            user_id: user.id,
          }
        ])
        .select()
        .single()

      if (error) throw error

      await fetchEntries()
      await fetchTodayEntry()
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create entry'
      setError(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    }
  }

  const updateEntry = async (entryId: string, updates: DailyEntryUpdate) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .update(updates)
        .eq('id', entryId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      await fetchEntries()
      await fetchTodayEntry()
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update entry'
      setError(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    }
  }

  const deleteEntry = async (entryId: string) => {
    if (!user) return { error: new Error('No user logged in') }

    try {
      const { error } = await supabase
        .from('daily_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id)

      if (error) throw error

      await fetchEntries()
      await fetchTodayEntry()
      
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete entry'
      setError(errorMessage)
      return { error: new Error(errorMessage) }
    }
  }

  const getWeeklyEntries = (weeksBack = 0) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() - (weeksBack * 7))
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return entries.filter(entry => {
      const entryDate = new Date(entry.entry_date)
      return entryDate >= startOfWeek && entryDate <= endOfWeek
    })
  }

  const getMonthlyEntries = (monthsBack = 0) => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth() - monthsBack, 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() - monthsBack + 1, 0)

    return entries.filter(entry => {
      const entryDate = new Date(entry.entry_date)
      return entryDate >= startOfMonth && entryDate <= endOfMonth
    })
  }

  const getAverageScores = (timeframe: 'week' | 'month' = 'week') => {
    const relevantEntries = timeframe === 'week' ? getWeeklyEntries() : getMonthlyEntries()
    
    if (relevantEntries.length === 0) {
      return {
        discomfort: 0,
        heartburn: 0,
        sleep: 0,
        count: 0
      }
    }

    const totals = relevantEntries.reduce(
      (acc, entry) => ({
        discomfort: acc.discomfort + entry.discomfort_level,
        heartburn: acc.heartburn + entry.heartburn_intensity,
        sleep: acc.sleep + entry.sleep_disruption,
      }),
      { discomfort: 0, heartburn: 0, sleep: 0 }
    )

    const count = relevantEntries.length
    return {
      discomfort: Math.round((totals.discomfort / count) * 10) / 10,
      heartburn: Math.round((totals.heartburn / count) * 10) / 10,
      sleep: Math.round((totals.sleep / count) * 10) / 10,
      count
    }
  }

  const getStreak = () => {
    if (entries.length === 0) return 0

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    )

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.entry_date)
      entryDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }

    return streak
  }

  const getTreatmentConsistency = (timeframe: 'week' | 'month' = 'week') => {
    const relevantEntries = timeframe === 'week' ? getWeeklyEntries() : getMonthlyEntries()
    
    if (relevantEntries.length === 0) {
      return { morning: 0, evening: 0, overall: 0 }
    }

    const totals = relevantEntries.reduce(
      (acc, entry) => ({
        morning: acc.morning + (entry.morning_dose ? 1 : 0),
        evening: acc.evening + (entry.evening_dose ? 1 : 0),
      }),
      { morning: 0, evening: 0 }
    )

    const count = relevantEntries.length
    const morningPercentage = Math.round((totals.morning / count) * 100)
    const eveningPercentage = Math.round((totals.evening / count) * 100)
    const overallPercentage = Math.round(((totals.morning + totals.evening) / (count * 2)) * 100)

    return {
      morning: morningPercentage,
      evening: eveningPercentage,
      overall: overallPercentage
    }
  }

  const getMostCommonTriggers = (timeframe: 'week' | 'month' = 'week') => {
    const relevantEntries = timeframe === 'week' ? getWeeklyEntries() : getMonthlyEntries()
    
    const triggerCounts: Record<string, number> = {}
    
    relevantEntries.forEach(entry => {
      entry.trigger_foods.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1
      })
    })

    return Object.entries(triggerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }))
  }

  return {
    entries,
    todayEntry,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    fetchEntries,
    fetchTodayEntry,
    getWeeklyEntries,
    getMonthlyEntries,
    getAverageScores,
    getStreak,
    getTreatmentConsistency,
    getMostCommonTriggers,
    hasTrackedToday: !!todayEntry,
    clearError: () => setError(null)
  }
}