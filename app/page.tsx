import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { InvoiceStatusChart } from "@/components/dashboard/invoice-status-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { sampleDashboardMetrics, sampleChartData, sampleInvoices } from "@/lib/sample-data"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
        </div>
      </div>

      <QuickActions />

      <MetricsCards metrics={sampleDashboardMetrics} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={sampleChartData} />
        <InvoiceStatusChart invoices={sampleInvoices} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RecentActivity invoices={sampleInvoices} />
      </div>
    </div>
  )
}
