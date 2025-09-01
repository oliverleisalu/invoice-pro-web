"use client"

import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { InvoiceStatusChart } from "@/components/dashboard/invoice-status-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useInvoices } from "@/hooks/use-invoices"

// Sample data for charts when no real data exists
const sampleDashboardMetrics = [
  { title: "Total Revenue", value: "$0.00", change: "+0%", changeType: "positive" as const },
  { title: "Pending Invoices", value: "0", change: "0%", changeType: "neutral" as const },
  { title: "Paid Invoices", value: "0", change: "0%", changeType: "neutral" as const },
  { title: "Active Clients", value: "0", change: "0%", changeType: "neutral" as const },
]

const sampleChartData = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
]

export default function DashboardPage() {
  const { invoices, loading } = useInvoices()

  if (loading) {
    return (
      <div className="flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
      {/* Mobile-first header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex-shrink-0 mt-2 sm:mt-0">
          <QuickActions />
        </div>
      </div>

      <MetricsCards metrics={sampleDashboardMetrics} />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <RevenueChart data={sampleChartData} />
        <InvoiceStatusChart invoices={invoices} />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1">
        <RecentActivity invoices={invoices} />
      </div>
    </div>
  )
}
