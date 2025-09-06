import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client configuration for the polling application.
 * 
 * This client is configured with environment variables for security and flexibility.
 * Falls back to demo credentials if environment variables are not set, which is useful
 * for development and testing but should be replaced with actual credentials in production.
 * 
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eohllhagsldzstxqnehx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaGxsaGFnc2xkenN0eHFuZWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzAxNTAsImV4cCI6MjA3MjA0NjE1MH0.1v3oJFL2nLK8e5miOi4_a9MIrGvH6uCXhzeN4D22bBs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * TypeScript interfaces for the polling application database schema.
 * 
 * These interfaces provide type safety when working with Supabase data
 * and ensure consistency across the application. They mirror the database
 * schema defined in supabase-schema.sql.
 */

/**
 * Represents a poll in the database.
 * 
 * @interface Poll
 * @property {string} id - Unique identifier (UUID)
 * @property {string} title - Poll title (required)
 * @property {string | null} description - Optional poll description
 * @property {string} created_at - ISO timestamp of creation
 * @property {string} updated_at - ISO timestamp of last update
 */
export interface Poll {
  id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * Represents a poll option with vote count.
 * 
 * @interface PollOption
 * @property {string} id - Unique identifier (UUID)
 * @property {string} poll_id - Foreign key to polls table
 * @property {string} text - Option text content
 * @property {number} votes - Current vote count (auto-updated by triggers)
 * @property {string} created_at - ISO timestamp of creation
 */
export interface PollOption {
  id: string
  poll_id: string
  text: string
  votes: number
  created_at: string
}

/**
 * Represents an individual vote record.
 * 
 * @interface Vote
 * @property {string} id - Unique identifier (UUID)
 * @property {string} poll_id - Foreign key to polls table
 * @property {string} option_id - Foreign key to poll_options table
 * @property {string} created_at - ISO timestamp of vote
 */
export interface Vote {
  id: string
  poll_id: string
  option_id: string
  created_at: string
}
