import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if environment variables are not set
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => ({
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }),
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        // Mock successful login for demo purposes
        if (email && password) {
          return {
            data: {
              user: {
                id: 'mock-user-id',
                email,
                created_at: new Date().toISOString(),
              },
              session: {
                access_token: 'mock-token',
                refresh_token: 'mock-refresh-token',
                expires_at: Date.now() + 3600000,
              }
            },
            error: null
          }
        }
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid credentials' }
        }
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        // Mock successful registration
        if (email && password && password.length >= 6) {
          return {
            data: {
              user: {
                id: 'mock-user-id',
                email,
                created_at: new Date().toISOString(),
              },
              session: null
            },
            error: null
          }
        }
        return {
          data: { user: null, session: null },
          error: { message: 'Registration failed' }
        }
      },
      signOut: async () => ({ error: null })
    }
  }
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

// Types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
