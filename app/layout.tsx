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
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
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
              <div className="lg:block bg-gray-50">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
        <Analytics />
      </body>
    </html>
  )
}
