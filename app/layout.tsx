import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Suspense } from "react"
import { SidebarToggle } from "@/components/sidebar-toggle"
import { SidebarProvider } from "@/components/sidebar-provider"
import { AuthProvider } from "@/lib/auth-context"
import { AppContent } from "@/components/app-content"

export const metadata: Metadata = {
  title: "InvoiceApp - Modern Invoice Management",
  description: "Create, manage, and track invoices with comprehensive analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-gray-50`}>
        <AuthProvider>
          <AppContent>
            {children}
          </AppContent>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
