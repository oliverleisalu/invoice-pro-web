"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Payment, Invoice } from "@/lib/types"
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, Download } from "lucide-react"

interface PaymentTableProps {
  payments: Payment[]
  invoices: Invoice[]
  onAddPayment?: () => void
  onEditPayment?: (payment: Payment) => void
  onDeletePayment?: (paymentId: string) => void
}

export function PaymentTable({ payments, invoices, onAddPayment, onEditPayment, onDeletePayment }: PaymentTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof Payment>("payment_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Create a map of invoice data for quick lookup
  const invoiceMap = invoices.reduce(
    (acc, invoice) => {
      acc[invoice.id] = invoice
      return acc
    },
    {} as Record<string, Invoice>,
  )

  const filteredPayments = payments
    .filter((payment) => {
      const invoice = invoiceMap[payment.invoice_id]
      const matchesSearch =
        invoice?.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice?.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMethod = methodFilter === "all" || payment.payment_method === methodFilter
      return matchesSearch && matchesMethod
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const direction = sortDirection === "asc" ? 1 : -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * direction
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * direction
      }
      return 0
    })

  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const uniquePaymentMethods = [...new Set(payments.map((p) => p.payment_method))]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{formatCurrency(totalPayments)}</div>
            <p className="text-xs text-muted-foreground">Total Payments Received</p>
          </CardContent>
        </Card>
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {formatCurrency(
                payments
                  .filter((p) => new Date(p.payment_date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                  .reduce((sum, p) => sum + p.amount, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 Days</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            <Button onClick={onAddPayment}>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {uniquePaymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("payment_date")}>
                  Date
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("payment_method")}>
                  Method
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 text-right" onClick={() => handleSort("amount")}>
                  Amount
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const invoice = invoiceMap[payment.invoice_id]
                return (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell className="font-medium">{invoice?.invoice_number || "N/A"}</TableCell>
                    <TableCell>{invoice?.client?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.payment_method}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Received</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditPayment?.(payment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => onDeletePayment?.(payment.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
