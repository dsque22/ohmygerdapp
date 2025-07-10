import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function calculateStreak(entries: Array<{ entry_date: string }>): number {
  if (!entries.length) return 0
  
  const sortedEntries = entries
    .map(entry => new Date(entry.entry_date))
    .sort((a, b) => b.getTime() - a.getTime())
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (const entryDate of sortedEntries) {
    const entryDateNormalized = new Date(entryDate)
    entryDateNormalized.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((currentDate.getTime() - entryDateNormalized.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
    } else if (daysDiff > streak) {
      break
    }
  }
  
  return streak
}

export function calculateAverage(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const SYMPTOMS = [
  'heartburn',
  'regurgitation',
  'chest_pain',
  'difficulty_swallowing',
  'chronic_cough',
  'hoarse_voice',
  'bloating',
  'nausea',
] as const

export const TRIGGER_FOODS = [
  'spicy_foods',
  'citrus_fruits',
  'tomatoes',
  'chocolate',
  'coffee',
  'alcohol',
  'fatty_foods',
  'fried_foods',
  'garlic',
  'onions',
  'peppermint',
  'carbonated_drinks',
] as const

export const SYMPTOM_LABELS: Record<string, string> = {
  heartburn: 'Heartburn',
  regurgitation: 'Regurgitation',
  chest_pain: 'Chest Pain',
  difficulty_swallowing: 'Difficulty Swallowing',
  chronic_cough: 'Chronic Cough',
  hoarse_voice: 'Hoarse Voice',
  bloating: 'Bloating',
  nausea: 'Nausea',
}

export const TRIGGER_FOOD_LABELS: Record<string, string> = {
  spicy_foods: 'Spicy Foods',
  citrus_fruits: 'Citrus Fruits',
  tomatoes: 'Tomatoes',
  chocolate: 'Chocolate',
  coffee: 'Coffee',
  alcohol: 'Alcohol',
  fatty_foods: 'Fatty Foods',
  fried_foods: 'Fried Foods',
  garlic: 'Garlic',
  onions: 'Onions',
  peppermint: 'Peppermint',
  carbonated_drinks: 'Carbonated Drinks',
}