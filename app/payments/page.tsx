"use client"

import { useState } from "react"
import { PaymentTable } from "@/components/payments/payment-table"
import { PaymentDialog } from "@/components/payments/payment-dialog"
import { samplePayments, sampleInvoices } from "@/lib/sample-data"
import type { Payment } from "@/lib/types"

export default function PaymentsPage() {
  const [payments, setPayments] = useState(samplePayments)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>()

  const handleAddPayment = () => {
    setEditingPayment(undefined)
    setDialogOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment)
    setDialogOpen(true)
  }

  const handleSavePayment = (paymentData: Partial<Payment>) => {
    if (editingPayment) {
      // Update existing payment
      setPayments(payments.map((p) => (p.id === editingPayment.id ? { ...p, ...paymentData } : p)))
    } else {
      // Add new payment
      const newPayment: Payment = {
        id: `payment-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...paymentData,
      } as Payment
      setPayments([...payments, newPayment])
    }
  }

  const handleDeletePayment = (paymentId: string) => {
    if (confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
      setPayments(payments.filter((p) => p.id !== paymentId))
    }
  }

  return (
    <div className="flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
      {/* Mobile-first header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Payments</h1>
          <p className="text-muted-foreground mt-1">Track and manage payment records</p>
        </div>
      </div>

      <PaymentTable
        payments={payments}
        invoices={sampleInvoices}
        onAddPayment={handleAddPayment}
        onEditPayment={handleEditPayment}
        onDeletePayment={handleDeletePayment}
      />

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        payment={editingPayment}
        invoices={sampleInvoices}
        onSave={handleSavePayment}
      />
    </div>
  )
}
