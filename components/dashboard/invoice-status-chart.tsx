"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import type { Invoice } from "@/lib/types"

interface InvoiceStatusChartProps {
  invoices: Invoice[]
}

export function InvoiceStatusChart({ invoices }: InvoiceStatusChartProps) {
  const statusCounts = invoices.reduce(
    (acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    status,
  }))

  const COLORS = {
    paid: "hsl(var(--chart-1))",
    sent: "hsl(var(--chart-2))",
    overdue: "hsl(var(--chart-3))",
    draft: "hsl(var(--chart-4))",
  }

  const chartConfig = {
    value: {
      label: "Count",
    },
    paid: {
      label: "Paid",
      color: "hsl(var(--chart-1))",
    },
    sent: {
      label: "Sent",
      color: "hsl(var(--chart-2))",
    },
    overdue: {
      label: "Overdue",
      color: "hsl(var(--chart-3))",
    },
    draft: {
      label: "Draft",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <Card className="col-span-3 shadow-2xl">
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
        <CardDescription>Breakdown of invoice statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] text-green-700">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS]} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string, props: any) => [
                  `${value} invoices`,
                  props.payload?.name || name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((entry) => (
            <div key={entry.status} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[entry.status as keyof typeof COLORS] }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
