"use client"

import { useState } from "react"
import { PaymentTable } from "@/components/payments/payment-table"
import { PaymentDialog } from "@/components/payments/payment-dialog"
import { usePayments } from "@/hooks/use-payments"
import { useInvoices } from "@/hooks/use-invoices"
import type { Database } from "@/types/database"

type Payment = Database['public']['Tables']['payments']['Row']

export default function PaymentsPage() {
  const { payments, loading: paymentsLoading, addPayment, updatePayment, deletePayment } = usePayments()
  const { invoices, loading: invoicesLoading } = useInvoices()
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

  const handleSavePayment = async (paymentData: Partial<Payment>) => {
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.id, paymentData)
      } else {
        await addPayment(paymentData)
      }
      setDialogOpen(false)
      setEditingPayment(undefined)
    } catch (error) {
      console.error("Failed to save payment:", error)
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (confirm("Are you sure you want to delete this payment? This action cannot be undone.")) {
      try {
        await deletePayment(paymentId)
      } catch (error) {
        console.error("Failed to delete payment:", error)
      }
    }
  }

  if (paymentsLoading || invoicesLoading) {
    return (
      <div className="flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payments...</p>
          </div>
        </div>
      </div>
    )
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
        invoices={invoices}
        onAddPayment={handleAddPayment}
        onEditPayment={handleEditPayment}
        onDeletePayment={handleDeletePayment}
      />

      <PaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        payment={editingPayment}
        invoices={invoices}
        onSave={handleSavePayment}
      />
    </div>
  )
}
