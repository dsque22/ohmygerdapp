import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { Database } from '@/lib/database.types'

type DailyEntry = Database['public']['Tables']['daily_entries']['Row']

export function useTracking() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(365) // Fetch last year of entries

      if (error) throw new Error(error.message)
      
      setEntries(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchTodayEntry = useCallback(async () => {
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', today)
      .single()

    if (error && error.code !== 'PGRST116') { // Ignore 'exact one row' error
      console.error("Error fetching today's entry:", error)
    }
    
    setTodayEntry(data || null)
  }, [user])

  useEffect(() => {
    if (user) {
      fetchEntries()
      fetchTodayEntry()
    } else {
      setLoading(false)
    }
  }, [user, fetchEntries, fetchTodayEntry])

  const createEntry = async (entryData: Omit<DailyEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('daily_entries')
      .insert({ ...entryData, user_id: user.id })
      .select()
      .single()

    if (error) return { data: null, error }
    
    await fetchEntries() // Refresh all entries
    await fetchTodayEntry() // Refresh today's entry
    return { data, error: null }
  }

  const updateEntry = async (entryId: string, updates: Partial<DailyEntry>) => {
    const { data, error } = await supabase
      .from('daily_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single()
    
    if (error) return { data: null, error }

    await fetchEntries()
    await fetchTodayEntry()
    return { data, error: null }
  }

  const deleteEntry = async (entryId: string) => {
    const { error } = await supabase
      .from('daily_entries')
      .delete()
      .eq('id', entryId)
    
    if (error) return { error }

    await fetchEntries()
    await fetchTodayEntry()
    return { error: null }
  }

  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.entry_date)
      return entryDate >= startDate && entryDate <= endDate
    })
  }

  const getWeeklyEntries = (weeksBack = 0) => {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - (weeksBack * 7))
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 6)
    
    return getEntriesByDateRange(startDate, endDate)
  }

  const getMonthlyEntries = (monthsBack = 0) => {
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() - monthsBack)
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

    return getEntriesByDateRange(startDate, endDate)
  }

  const getAverageScores = (timeframe: 'week' | 'month' = 'week') => {
    const relevantEntries = timeframe === 'week' ? getWeeklyEntries() : getMonthlyEntries()
    
    if (relevantEntries.length === 0) {
      return { discomfort: 0, heartburn: 0, sleep: 0, count: 0 }
    }

    const totals = relevantEntries.reduce(
      (acc, entry) => ({
        discomfort: acc.discomfort + (entry.discomfort_level || 0),
        heartburn: acc.heartburn + (entry.heartburn_intensity || 0),
        sleep: acc.sleep + (entry.sleep_disruption || 0),
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

    const sortedEntries = [...entries].sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
    
    let streak = 0
    let expectedDate = new Date()
    
    // Check if today's entry exists
    const todayStr = expectedDate.toISOString().split('T')[0]
    const hasTodayEntry = sortedEntries.some(e => e.entry_date === todayStr)
    
    if (hasTodayEntry) {
      streak++
      expectedDate.setDate(expectedDate.getDate() - 1)
    } else {
      // If no entry for today, check if the last entry was yesterday
      const lastEntryDate = new Date(sortedEntries[0].entry_date)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastEntryDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) {
        return 0 // Streak is broken if last entry wasn't yesterday or today
      }
      expectedDate = lastEntryDate
    }

    for (let i = streak > 0 ? 1 : 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].entry_date)
      const expectedDateStr = expectedDate.toISOString().split('T')[0]
      
      if (entryDate.toISOString().split('T')[0] === expectedDateStr) {
        streak++
        expectedDate.setDate(expectedDate.getDate() - 1)
      } else {
        break // Gap in dates, streak ends
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
    return {
      morning: Math.round((totals.morning / count) * 100),
      evening: Math.round((totals.evening / count) * 100),
      overall: Math.round(((totals.morning + totals.evening) / (count * 2)) * 100)
    }
  }

  const getMostCommonTriggers = (timeframe: 'week' | 'month' = 'week') => {
    const relevantEntries = timeframe === 'week' ? getWeeklyEntries() : getMonthlyEntries()
    
    const triggerCounts: Record<string, number> = {}
    
    relevantEntries.forEach(entry => {
      if (entry.trigger_foods) {
        entry.trigger_foods.forEach((trigger: string) => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1
        })
      }
    })

    return Object.entries(triggerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }))
  }

  const exportAllEntries = async () => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: true })

    if (error) throw new Error(error.message)
    
    return data
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
    exportAllEntries,
    hasTrackedToday: !!todayEntry,
    clearError: () => setError(null)
  }
}