import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { InvoiceStatusChart } from "@/components/dashboard/invoice-status-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { sampleDashboardMetrics, sampleChartData, sampleInvoices } from "@/lib/sample-data"

export default function DashboardPage() {
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
        <InvoiceStatusChart invoices={sampleInvoices} />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1">
        <RecentActivity invoices={sampleInvoices} />
      </div>
    </div>
  )
}
