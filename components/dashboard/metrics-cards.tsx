import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { DashboardMetrics } from "@/lib/types"
import { TrendingUp, TrendingDown, FileText, AlertCircle, DollarSign } from "lucide-react"

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const isPositiveChange = metrics.monthly_revenue_change >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.monthly_revenue)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {isPositiveChange ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
            )}
            <span className={isPositiveChange ? "text-green-600" : "text-red-600"}>
              {Math.abs(metrics.monthly_revenue_change)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Invoices This Month</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total_invoices_this_month}</div>
          <p className="text-xs text-muted-foreground">Total invoices sent</p>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{metrics.outstanding_invoices}</div>
          <p className="text-xs text-muted-foreground">Awaiting payment</p>
        </CardContent>
      </Card>

      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{metrics.recent_payments}</div>
          <p className="text-xs text-muted-foreground">This week</p>
        </CardContent>
      </Card>
    </div>
  )
}
