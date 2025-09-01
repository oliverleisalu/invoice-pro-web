import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Invoice } from "@/lib/types"
import { formatCurrency, formatDate, getInvoiceStatusColor } from "@/lib/utils"

interface RecentActivityProps {
  invoices: Invoice[]
}

export function RecentActivity({ invoices }: RecentActivityProps) {
  // Sort by most recent and take first 5
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  return (
    <Card className="col-span-3 shadow-2xl">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest invoice updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{invoice.invoice_number}</span>
                  <Badge className={getInvoiceStatusColor(invoice.status)}>{invoice.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {invoice.client?.name} • {formatDate(invoice.updated_at)}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(invoice.total_amount)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
