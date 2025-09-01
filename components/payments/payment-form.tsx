"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Payment, Invoice } from "@/lib/types"
import { Save, X, CreditCard } from "lucide-react"

interface PaymentFormProps {
  payment?: Payment
  invoices: Invoice[]
  onSave?: (payment: Partial<Payment>) => void
  onCancel?: () => void
}

export function PaymentForm({ payment, invoices, onSave, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    invoice_id: payment?.invoice_id || "",
    amount: payment?.amount || 0,
    payment_date: payment?.payment_date ? payment.payment_date.split("T")[0] : new Date().toISOString().split("T")[0],
    payment_method: payment?.payment_method || "Bank Transfer",
    notes: payment?.notes || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter to show only unpaid or partially paid invoices
  const availableInvoices = invoices.filter((invoice) => {
    if (payment && invoice.id === payment.invoice_id) return true
    return invoice.status !== "paid"
  })

  const selectedInvoice = invoices.find((inv) => inv.id === formData.invoice_id)
  const remainingAmount = selectedInvoice
    ? selectedInvoice.total_amount - (selectedInvoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0)
    : 0

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.invoice_id) {
      newErrors.invoice_id = "Please select an invoice"
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Payment amount must be greater than 0"
    } else if (formData.amount > remainingAmount && !payment) {
      newErrors.amount = `Payment amount cannot exceed remaining balance of ${formatCurrency(remainingAmount)}`
    }

    if (!formData.payment_method) {
      newErrors.payment_method = "Please select a payment method"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave?.(formData)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleQuickAmount = (percentage: number) => {
    if (selectedInvoice) {
      const amount = Math.round(remainingAmount * percentage * 100) / 100
      handleInputChange("amount", amount)
    }
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {payment ? "Edit Payment" : "Record New Payment"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoice_id">
              Invoice <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.invoice_id} onValueChange={(value) => handleInputChange("invoice_id", value)}>
              <SelectTrigger className={errors.invoice_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Select an invoice" />
              </SelectTrigger>
              <SelectContent>
                {availableInvoices.map((invoice) => (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>
                        {invoice.invoice_number} - {invoice.client?.name}
                      </span>
                      <span className="ml-4 text-muted-foreground">{formatCurrency(invoice.total_amount)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.invoice_id && <p className="text-sm text-destructive">{errors.invoice_id}</p>}
          </div>

          {selectedInvoice && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Invoice Total:</span>
                    <div className="font-medium">{formatCurrency(selectedInvoice.total_amount)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Remaining Balance:</span>
                    <div className="font-medium text-orange-600">{formatCurrency(remainingAmount)}</div>
                  </div>
                </div>
                {!payment && (
                  <div className="flex gap-2 mt-3">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAmount(0.25)}>
                      25%
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAmount(0.5)}>
                      50%
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAmount(0.75)}>
                      75%
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleQuickAmount(1)}>
                      Full Amount
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Payment Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.amount ? "border-destructive" : ""}
              />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">
                Payment Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => handleInputChange("payment_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">
              Payment Method <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => handleInputChange("payment_method", value)}
            >
              <SelectTrigger className={errors.payment_method ? "border-destructive" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Stripe">Stripe</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.payment_method && <p className="text-sm text-destructive">{errors.payment_method}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about this payment"
              rows={3}
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {payment ? "Update Payment" : "Record Payment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
