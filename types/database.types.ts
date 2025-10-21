export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          department: string | null
          position: string | null
          interests: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          department?: string | null
          position?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          department?: string | null
          position?: string | null
          interests?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string
          mode: 'general' | 'creative'
          probability: number | null
          keywords: string[]
          saved: boolean
          is_shared: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: string
          mode: 'general' | 'creative'
          probability?: number | null
          keywords?: string[]
          saved?: boolean
          is_shared?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          mode?: 'general' | 'creative'
          probability?: number | null
          keywords?: string[]
          saved?: boolean
          is_shared?: boolean
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
