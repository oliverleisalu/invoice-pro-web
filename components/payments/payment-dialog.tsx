"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "./payment-form"
import type { Payment, Invoice } from "@/lib/types"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment?: Payment
  invoices: Invoice[]
  onSave: (payment: Partial<Payment>) => void
}

export function PaymentDialog({ open, onOpenChange, payment, invoices, onSave }: PaymentDialogProps) {
  const handleSave = (paymentData: Partial<Payment>) => {
    onSave(paymentData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{payment ? "Edit Payment" : "Record New Payment"}</DialogTitle>
        </DialogHeader>
        <PaymentForm payment={payment} invoices={invoices} onSave={handleSave} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
