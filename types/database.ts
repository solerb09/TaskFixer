export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionTier = 'free_trial' | 'educator' | 'school'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete'
export type BillingInterval = 'month' | 'year'
export type ThemePreference = 'light' | 'dark'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string // matches auth.users.id
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: SubscriptionTier
          subscription_status: SubscriptionStatus
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          billing_interval: BillingInterval | null
          subscription_ends_at: string | null
          theme_preference: ThemePreference
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          billing_interval?: BillingInterval | null
          subscription_ends_at?: string | null
          theme_preference?: ThemePreference
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: SubscriptionTier
          subscription_status?: SubscriptionStatus
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          billing_interval?: BillingInterval | null
          subscription_ends_at?: string | null
          theme_preference?: ThemePreference
          created_at?: string
          updated_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          pdf_redesigns_count: number
          word_count_used: number
          files_uploaded: number
          last_reset_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pdf_redesigns_count?: number
          word_count_used?: number
          files_uploaded?: number
          last_reset_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pdf_redesigns_count?: number
          word_count_used?: number
          files_uploaded?: number
          last_reset_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      sales_inquiries: {
        Row: {
          id: string
          name: string
          email: string
          organization: string | null
          phone: string | null
          message: string | null
          status: 'new' | 'contacted' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          organization?: string | null
          phone?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          organization?: string | null
          phone?: string | null
          message?: string | null
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          thread_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          thread_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          thread_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          chat_session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
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
