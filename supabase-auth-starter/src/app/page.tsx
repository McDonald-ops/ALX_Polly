'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Supabase Auth Starter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A complete authentication solution built with Next.js, Supabase, and shadcn/ui
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>🔐 Secure Authentication</CardTitle>
              <CardDescription>Built with Supabase Auth</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Enterprise-grade authentication with email/password, social logins, and more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚡ Modern Stack</CardTitle>
              <CardDescription>Next.js 15 + TypeScript</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Built with the latest Next.js features, TypeScript, and Tailwind CSS.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎨 Beautiful UI</CardTitle>
              <CardDescription>shadcn/ui Components</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Clean, accessible components that you can customize to match your brand.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 space-y-4">
          <div className="space-x-4">
            <Button 
              onClick={() => router.push('/auth/login')}
              size="lg"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push('/auth/register')}
              variant="outline"
              size="lg"
            >
              Create Account
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            Get started by creating an account or signing in to your existing one
          </p>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">User Registration</h3>
              <p className="text-gray-600">Secure account creation with email verification</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">User Login</h3>
              <p className="text-gray-600">Simple and secure authentication flow</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">Protected Routes</h3>
              <p className="text-gray-600">Automatic redirection for unauthenticated users</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h3 className="font-semibold mb-2">User Dashboard</h3>
              <p className="text-gray-600">Personalized dashboard with account management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
