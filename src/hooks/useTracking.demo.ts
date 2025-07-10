import { useState, useEffect } from 'react'

// Demo tracking hook that works without Supabase for development/testing
export function useTracking() {
  const [entries, setEntries] = useState<any[]>([])
  const [todayEntry, setTodayEntry] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data
  useEffect(() => {
    // Generate some mock entries for the past week
    const mockEntries = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      mockEntries.push({
        id: `entry-${i}`,
        user_id: 'demo-user-123',
        entry_date: date.toISOString().split('T')[0],
        discomfort_level: Math.floor(Math.random() * 5) + 3, // 3-7
        heartburn_intensity: Math.floor(Math.random() * 4) + 2, // 2-5
        sleep_disruption: Math.floor(Math.random() * 3) + 1, // 1-3
        symptoms: ['heartburn', Math.random() > 0.5 ? 'regurgitation' : 'bloating'],
        morning_dose: Math.random() > 0.3,
        evening_dose: Math.random() > 0.2,
        trigger_foods: Math.random() > 0.5 ? ['spicy_foods'] : ['coffee'],
        notes: i === 0 ? 'Feeling better today' : '',
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
      })
    }
    setEntries(mockEntries)
    
    // Set today's entry if it exists (last entry)
    const today = new Date().toISOString().split('T')[0]
    const todaysEntry = mockEntries.find(entry => entry.entry_date === today)
    setTodayEntry(todaysEntry || null)
  }, [])

  const createEntry = async (entryData: any) => {
    const newEntry = {
      id: `entry-${Date.now()}`,
      user_id: 'demo-user-123',
      ...entryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setEntries(prev => [...prev, newEntry])
    setTodayEntry(newEntry)
    return { data: newEntry, error: null }
  }

  const updateEntry = async (entryId: string, updates: any) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, ...updates, updated_at: new Date().toISOString() } : entry
    ))
    if (todayEntry?.id === entryId) {
      setTodayEntry((prev: any) => ({ ...prev, ...updates }))
    }
    return { data: null, error: null }
  }

  const deleteEntry = async (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId))
    if (todayEntry?.id === entryId) {
      setTodayEntry(null)
    }
    return { error: null }
  }

  const fetchEntries = async () => {
    // Already loaded in useEffect
  }

  const fetchTodayEntry = async () => {
    // Already loaded in useEffect
  }

  const getWeeklyEntries = (weeksBack = 0) => {
    return entries.slice(-7) // Last 7 entries
  }

  const getMonthlyEntries = (monthsBack = 0) => {
    return entries // All entries for demo
  }

  const getAverageScores = (timeframe: 'week' | 'month' = 'week') => {
    const relevantEntries = getWeeklyEntries()
    
    if (relevantEntries.length === 0) {
      return { discomfort: 0, heartburn: 0, sleep: 0, count: 0 }
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
    return entries.length // Simple demo streak
  }

  const getTreatmentConsistency = (timeframe: 'week' | 'month' = 'week') => {
    const relevantEntries = getWeeklyEntries()
    
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
    const relevantEntries = getWeeklyEntries()
    
    const triggerCounts: Record<string, number> = {}
    
    relevantEntries.forEach(entry => {
      entry.trigger_foods.forEach((trigger: string) => {
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