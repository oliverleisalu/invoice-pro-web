"use client"

import { useAuth } from '@/lib/auth-context'
import { LoginForm } from '@/components/auth/login-form'
import { Sidebar } from '@/components/sidebar'
import { Suspense } from 'react'
import { SidebarToggle } from '@/components/sidebar-toggle'
import { SidebarProvider } from '@/components/sidebar-provider'

interface AppContentProps {
  children: React.ReactNode
}

export function AppContent({ children }: AppContentProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 overflow-auto relative">
          {/* Mobile header with menu button */}
          <div className="lg:hidden flex items-center h-16 px-4 border-b border-border bg-background">
            <SidebarToggle />
            <h1 className="text-lg font-semibold">InvoiceApp</h1>
          </div>

          {/* Main content */}
          <div className="lg:block">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
