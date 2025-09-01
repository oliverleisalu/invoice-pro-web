"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ClientForm } from "./client-form"
import type { Client } from "@/lib/types"

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
  onSave: (client: Partial<Client>) => void
}

export function ClientDialog({ open, onOpenChange, client, onSave }: ClientDialogProps) {
  const handleSave = (clientData: Partial<Client>) => {
    onSave(clientData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
        </DialogHeader>
        <ClientForm client={client} onSave={handleSave} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
