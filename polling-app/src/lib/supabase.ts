import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eohllhagsldzstxqnehx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaGxsaGFnc2xkenN0eHFuZWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzAxNTAsImV4cCI6MjA3MjA0NjE1MH0.1v3oJFL2nLK8e5miOi4_a9MIrGvH6uCXhzeN4D22bBs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Poll {
  id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  votes: number
  created_at: string
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  created_at: string
}
