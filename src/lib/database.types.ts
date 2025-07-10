export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          age: number
          gender: string
          gerd_duration: string
          worst_symptoms: string[]
          liao_customer_status: string
          known_triggers: string[]
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          age: number
          gender: string
          gerd_duration: string
          worst_symptoms: string[]
          liao_customer_status: string
          known_triggers: string[]
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          age?: number
          gender?: string
          gerd_duration?: string
          worst_symptoms?: string[]
          liao_customer_status?: string
          known_triggers?: string[]
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      daily_entries: {
        Row: {
          id: string
          user_id: string
          entry_date: string
          discomfort_level: number
          heartburn_intensity: number
          sleep_disruption: number
          symptoms: string[]
          morning_dose: boolean
          evening_dose: boolean
          trigger_foods: string[]
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entry_date: string
          discomfort_level: number
          heartburn_intensity: number
          sleep_disruption: number
          symptoms: string[]
          morning_dose: boolean
          evening_dose: boolean
          trigger_foods: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entry_date?: string
          discomfort_level?: number
          heartburn_intensity?: number
          sleep_disruption?: number
          symptoms?: string[]
          morning_dose?: boolean
          evening_dose?: boolean
          trigger_foods?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          notification_preferences: {
            daily_reminder: boolean
            weekly_summary: boolean
            push_notifications: boolean
          }
          theme: string
          dashboard_preferences: {
            preferred_charts: string[]
            default_time_range: string
          }
          privacy_settings: {
            data_sharing: boolean
            analytics_tracking: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notification_preferences: {
            daily_reminder: boolean
            weekly_summary: boolean
            push_notifications: boolean
          }
          theme: string
          dashboard_preferences: {
            preferred_charts: string[]
            default_time_range: string
          }
          privacy_settings: {
            data_sharing: boolean
            analytics_tracking: boolean
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notification_preferences?: {
            daily_reminder: boolean
            weekly_summary: boolean
            push_notifications: boolean
          }
          theme?: string
          dashboard_preferences?: {
            preferred_charts: string[]
            default_time_range: string
          }
          privacy_settings?: {
            data_sharing: boolean
            analytics_tracking: boolean
          }
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}